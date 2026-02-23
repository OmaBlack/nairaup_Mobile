import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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
  unAuthReduxApiRequests,
  useGetPropertyFeaturesQuery,
  useGetPropertyQuery,
  useGetPropertyTypesAndCategoriesQuery,
} from "src/services/redux/apis/unauth.api.requests";
import { ValueType } from "react-native-dropdown-picker";
import { ImagePickerAsset } from "expo-image-picker";
import useImagePicker from "src/hooks/useImagePicker";
import {
  PropertyCategoryType,
  PropertyObjectType,
  PropertyType,
} from "src/types/properties.types";
import useLocation from "src/hooks/useLocation";
import {
  getPhysicalAddressFromCoordinates,
  removePostalCodes,
} from "src/utils/location.utils";
import useProperties from "src/hooks/apis/useProperties";
import { reduxApiRequests } from "src/services/redux/apis";
import { useFileUpload } from "src/hooks/apis/useFIle";
import { useAppDispatch, useAppSelector } from "src/hooks/useReduxHooks";
import { CreateFileName, GetMediaType } from "src/utils/file.utils";

export default function ApartmentEditScreen({
  navigation,
  route,
}: RootStackScreenProps<"ApartmentEditScreen">) {
  const type = "apartment";
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.auth.user);
  const [data, setData] = useState<PropertyObjectType>(route.params.data);
  const { data: propertyData, isFetching } = useGetPropertyQuery(data.id);
  const imageurls = data.imageurls.split(",");

  useEffect(() => {
    if (propertyData?.code === 200) setData(propertyData?.data);
  }, [propertyData]);

  const { location } = useLocation();

  const { checkTitleAvailability, updateProperty, loading } = useProperties();
  const { loading: uploading, uploadFile } = useFileUpload();

  const [titleAvailable, setTitleAvailable] = useState(true);
  const [propertyType, setPropertyType] = useState<PropertyType>(data.type);
  const [propertyCategory, setPropertyCategory] =
    useState<PropertyCategoryType>(data.category);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [price, setPrice] = useState(data.price);
  const [features, setFeatures] = useState<number[]>([...data?.featureids]);
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const [address, setAddress] = useState(data.address);
  const [locationAddress, setLocationAddress] = useState({
    geolocation: data?.geocode,
    state: data?.state,
    //@ts-ignore
    country: data?.country,
    city: data?.city,
  });

  useEffect(() => {
    if (title !== "" && address !== "")
      checkTitleAvailability(
        {
          address,
          title,
          city: locationAddress.city,
          //@ts-ignore
          id: data.id,
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

  const { isFetching: isFetchingPTC, data: ptcData } =
    useGetPropertyTypesAndCategoriesQuery(null);
  const { isFetching: fetchingFeatures, data: featuresData } =
    useGetPropertyFeaturesQuery(null);

  const uploadImages = async () => {
    const urls = [];
    for (const img of images) {
      const formData = new FormData();
      formData.append("path", `${type}s/${profile.id}`);
      //@ts-ignore
      formData.append("file", {
        name: CreateFileName(`${img?.uri}`),
        type: GetMediaType(`${img?.uri}`) || `image/jpeg`,
        uri: img?.uri,
      });
      const req = await uploadFile(formData, true);
      if (req.code === 200 && req.data.Location) urls.push(req.data.Location);
    }
    return urls;
  };
  const doNext = async () => {
    const images = await uploadImages();
    const req = await updateProperty(data?.id, {
      title,
      address,
      price,
      category: propertyCategory,
      city: locationAddress.city,
      description,
      featuredimageurl: images.length > 0 ? images[0] : undefined,
      imageurls:
        images.length > 1
          ? images.slice(1).toString()
          : images.length === 1
          ? images[0]
          : undefined,
      featureids: features,
      geocode: locationAddress.geolocation,
      state: locationAddress.state,
      type: propertyType,
    });
    if (req.code === 202) {
      dispatch(
        unAuthReduxApiRequests.endpoints.getProperty.initiate(data.id, {
          forceRefetch: true,
          subscribe: true,
        }),
      );
      navigation.goBack();
    }
    // navigation.navigate("ApartmentCreateDocsScreen", {
    //   ...route.params,
    //   data: {
    //     title,
    //     price,
    //     address,
    //     category: type === "hotel" ? "rent" : propertyCategory,
    //     description,
    //     features,
    //     images,
    //     type: type === "hotel" ? "hotel" : propertyType,
    //     ...locationAddress,
    //   },
    // });
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
                items={ptcData?.data?.types || []}
                value={propertyType}
                onSelectItem={(e: any) => setPropertyType(e?.value)}
                loading={isFetchingPTC}
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
                items={ptcData?.data?.categories || []}
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
          />
          <Text mb={fontUtils.h(10)}>Upload new property photos</Text>
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
          title={"Update"}
          onPress={doNext}
          loading={loading || uploading}
          disabled={title === "" || description === "" || !titleAvailable}
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
