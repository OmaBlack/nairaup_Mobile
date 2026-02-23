import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import layoutConstants from "src/constants/layout.constants";
import { Input, SelectInput } from "src/components/inputs.components";
import { Octicons } from "@expo/vector-icons";
import { colorDanger, colorPrimary } from "src/constants/colors.constants";
import {
  useGetPropertyFeaturesQuery,
  useGetPropertyTypesAndCategoriesQuery,
} from "src/services/redux/apis/unauth.api.requests";
import { ImagePickerAsset } from "expo-image-picker";
import useImagePicker from "src/hooks/useImagePicker";
import { PropertyCategoryType, PropertyType } from "src/types/properties.types";
import useLocation from "src/hooks/useLocation";
import {
  getPhysicalAddressFromCoordinates,
  removePostalCodes,
} from "src/utils/location.utils";
import useProperties from "src/hooks/apis/useProperties";

export default function ApartmentCreateNextScreen({
  navigation,
  route,
}: RootStackScreenProps<"ApartmentCreateNextScreen">) {
  const type = route.params.type;
  const { location } = useLocation();

  const { checkTitleAvailability, loading } = useProperties();

  const [titleAvailable, setTitleAvailable] = useState(true);
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [propertyCategory, setPropertyCategory] =
    useState<PropertyCategoryType>("sale");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState<number[]>([]);
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const [address, setAddress] = useState("");
  const [locationAddress, setLocationAddress] = useState({
    geolocation: "",
    state: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    if (title !== "" && address !== "")
      checkTitleAvailability(
        {
          address,
          title,
          city: locationAddress.city,
        },
        true,
      ).then((res) => {
        if (res.code !== 200) {
          setTitleAvailable(false);
        } else setTitleAvailable(true);
      });
  }, [title, locationAddress.city, address]);

  useEffect(() => {
    if (location?.coords) {
      getPhysicalAddressFromCoordinates(
        location?.coords.latitude,
        location?.coords.longitude,
        "",
      ).then((addr) => {
        if (addr !== null) {
          const _address = addr?.formatted_address || "Address not found";
          setAddress(_address);
          const _addressArr = _address?.split(",");
          setLocationAddress({
            city: removePostalCodes(
              `${_addressArr[_addressArr?.length - 3]?.trim()}`,
            ),
            state: `${_addressArr[_addressArr?.length - 2]?.trim()}`,
            country: `${_addressArr[_addressArr?.length - 1]?.trim()}`,
            // placeid: `${addr?.place_id}`,
            // reference: `${addr?.place_id}`,
            geolocation: `${location?.coords?.latitude || ""},${
              location?.coords?.longitude || ""
            }`,
          });
        }
      });
    }
  }, [location]);

  const { isFetching, data } = useGetPropertyTypesAndCategoriesQuery(null);
  const { isFetching: fetchingFeatures, data: featuresData } =
    useGetPropertyFeaturesQuery(null);

  const doNext = () => {
    navigation.replace("ApartmentCreateDocsScreen", {
      ...route.params,
      data: {
        title,
        price,
        address,
        category: type === "hotel" ? "rent" : propertyCategory,
        description,
        features,
        images,
        type: type === "hotel" ? "hotel" : propertyType,
        ...locationAddress,
      },
    });
  };

  const doPickImages = async () => {
    const res = await useImagePicker({
      allowsMultipleSelection: true,
      selectionLimit: 15,
      allowsEditing: false,
    });
    if (res && res?.length > 0) setImages(res);
  };

  const onSelectFeature = (items: any[]) => {
    const values = items.map((item) => {
      return item.id;
    });
    setFeatures([...values]);
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView>
        <View style={{ flex: 1 }}>
          {type === "apartment" ? (
            <>
              <Text mb={fontUtils.h(10)}>Property type</Text>
              <SelectInput
                items={data?.data?.types || []}
                value={propertyType}
                onSelectItem={(e: any) => setPropertyType(e?.value)}
                loading={isFetching}
                listMode="MODAL"
                wrapperStyle={styles.selectWrapperStyle}
              />
            </>
          ) : null}
          <Input
            label={
              titleAvailable
                ? type === "apartment"
                  ? "Title"
                  : "Name"
                : type === "apartment"
                ? "Another property with same title exist"
                : "Another hotel with same name exist"
            }
            value={title}
            onChangeText={setTitle}
            labelStyle={{
              color: !titleAvailable ? colorDanger : undefined,
            }}
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            inputHeight={fontUtils.h(80)}
          />
          {type === "apartment" ? (
            <>
              <Text mb={fontUtils.h(10)}>Select category</Text>
              <SelectInput
                items={data?.data?.categories || []}
                value={propertyCategory}
                onSelectItem={(e: any) => setPropertyCategory(e?.value)}
                loading={isFetching}
                listMode="MODAL"
                wrapperStyle={styles.selectWrapperStyle}
              />
            </>
          ) : null}
          <Input label="Location" value={address} onChangeText={setAddress} />
          {type === "apartment" ? (
            <Input
              label="Enter price"
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
            />
          ) : null}
          <Text mb={fontUtils.h(10)}>Basic features</Text>
          <SelectInput
            items={featuresData?.data || []}
            value={features}
            onSelectItem={onSelectFeature}
            schema={{
              id: "id",
              value: "id",
              label: "feature",
            }}
            loading={fetchingFeatures}
            itemKey="id"
            multiple
            listMode="MODAL"
            searchable
            wrapperStyle={styles.selectWrapperStyle}
            modalContentContainerStyle={{
              paddingTop: Platform.select({ android: fontUtils.h(50) }),
            }}
          />
          <Text mb={fontUtils.h(10)}>Upload property photos</Text>
          <View style={[layoutConstants.styles.rowView]}>
            <TouchableOpacity
              onPress={doPickImages}
              style={layoutConstants.styles.uploadBtnStyle}
            >
              <Octicons
                name="upload"
                size={fontUtils.h(15)}
                color={colorPrimary}
              />
              <Text mt={fontUtils.h(5)} size={fontUtils.h(10)} align="center">
                Select photos to upload
              </Text>
            </TouchableOpacity>
            {images.length > 0 ? (
              <Text ml={fontUtils.w(20)} size={fontUtils.h(10)}>
                {`${images.length} file(s) selected`}
              </Text>
            ) : null}
          </View>
        </View>
        <Button
          title={"Next"}
          onPress={doNext}
          loading={loading}
          disabled={
            title === "" ||
            description === "" ||
            images.length < 1 ||
            !titleAvailable
          }
          wrapperStyle={{ marginTop: fontUtils.h(20) }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: fontUtils.h(20),
  },
  selectWrapperStyle: {
    marginBottom: fontUtils.h(20),
  },
});
