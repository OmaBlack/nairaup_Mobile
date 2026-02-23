import React, { useRef, useState } from "react";
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
import { Octicons } from "@expo/vector-icons";
import { colorPrimary } from "src/constants/colors.constants";
import { Modalize } from "react-native-modalize";
import { ResponseModal } from "./components/modal.components";
import { Input, SelectInput } from "src/components/inputs.components";
import useProperties from "src/hooks/apis/useProperties";
import { useFileUpload } from "src/hooks/apis/useFIle";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { CreateFileName, GetMediaType } from "src/utils/file.utils";
import { ImagePickerAsset } from "expo-image-picker";
import { useGetPropertyFeaturesQuery } from "src/services/redux/apis/unauth.api.requests";
import useImagePicker from "src/hooks/useImagePicker";

export default function ApartmentRoomsAddScreen({
  navigation,
  route,
}: RootStackScreenProps<"ApartmentRoomsAddScreen">) {
  const id = route.params.id;
  const { profile } = useAppSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [units, setUnits] = useState("1");
  const [features, setFeatures] = useState<number[]>([]);
  const [images, setImages] = useState<ImagePickerAsset[]>([]);

  const { loading, addRoom } = useProperties();
  const { loading: uploading, uploadFile } = useFileUpload();
  const { isFetching: fetchingFeatures, data: featuresData } =
    useGetPropertyFeaturesQuery(null);

  const doPickImages = async () => {
    const res = await useImagePicker({
      allowsMultipleSelection: true,
      selectionLimit: 4,
      allowsEditing: false,
    });
    if (res && res?.length > 0) setImages(res);
  };

  const uploadImages = async () => {
    const urls = [];
    for (const img of images) {
      const formData = new FormData();
      formData.append("path", `hotels/${profile.id}`);
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

  const modalRef = useRef<Modalize>(null);
  const doSumbit = async () => {
    const images = await uploadImages();
    const req = await addRoom({
      id,
      rooms: [
        {
          featuredimageurl: images.length > 0 ? images[0] : undefined,
          featureids: features,
          imageurls:
            images.length > 1
              ? images.slice(1).toString()
              : images.length === 1
              ? images[0]
              : undefined,
          description,
          price,
          title,
          totalrooms: Number(units),
        },
      ],
    });
    if (req.code === 201) {
      setImages([]);
      setPrice("");
      setTitle("");
      setDescription("");
      setUnits("1");
      setFeatures([]);
      modalRef.current?.open();
    }
  };

  const doCloseModal = () => {
    modalRef.current?.close();
  };

  const onSelectFeature = (items: any[]) => {
    const values = items.map((item) => {
      return item.id;
    });
    setFeatures([...values]);
  };

  // const disableBtn = useMemo(() => {
  //   if (type === "apartment") return !cofO?.uri;
  // }, [type, cofO]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView contentContainerStyle={{ paddingBottom: fontUtils.h(30) }}>
        <Input label={"Title"} value={title} onChangeText={setTitle} />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          inputHeight={fontUtils.h(80)}
        />
        <Input
          label="Units Avaialble"
          value={units}
          onChangeText={setUnits}
          keyboardType="number-pad"
        />
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
        <Input
          label="Enter price per night"
          value={price}
          onChangeText={setPrice}
          keyboardType="number-pad"
        />
        <Text mb={fontUtils.h(10)}>Upload room photos</Text>
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
              Select photo to upload
            </Text>
          </TouchableOpacity>
          {images.length > 0 ? (
            <Text ml={fontUtils.w(20)} size={fontUtils.h(10)}>
              {`${images.length} file(s) selected`}
            </Text>
          ) : null}
        </View>
      </ScrollView>
      <Button
        title={"Submit"}
        onPress={doSumbit}
        loading={loading || uploading}
        disabled={
          title === "" ||
          Number(price) < 0 ||
          Number(units) < 1 ||
          images.length < 1
        }
        wrapperStyle={{ marginTop: fontUtils.h(20) }}
      />
      <ResponseModal
        note={"Would you like to add another?"}
        title="Room Added"
        btnTitle={"Yes"}
        modalRef={modalRef}
        onClose={doCloseModal}
        onCancel={() => {
          modalRef.current?.close();
          navigation.popTo("App");
        }}
      />
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
