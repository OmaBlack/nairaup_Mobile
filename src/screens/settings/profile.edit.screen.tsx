import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  Icon,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableText,
  ViewableAvatar,
} from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import layoutConstants from "src/constants/layout.constants";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import fontUtils from "src/utils/font.utils";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Input, SelectInput } from "src/components/inputs.components";
import { TabBar, TabView } from "react-native-tab-view";
import useImagePicker from "src/hooks/useImagePicker";
import { useAppDispatch, useAppSelector } from "src/hooks/useReduxHooks";
import { Button } from "src/components/buttons.components";
import useUser from "src/hooks/apis/useUser";
import { useFileUpload } from "src/hooks/apis/useFIle";
import { CreateFileName, GetMediaType } from "src/utils/file.utils";
import { DocumentPickerAsset } from "expo-document-picker";
import useDocumentPicker from "src/hooks/useDocumentPicker";
import { ImagePickerAsset } from "expo-image-picker";
import { useGetProfessionsQuery } from "src/services/redux/apis/unauth.api.requests";
import { Image } from "expo-image";
import useLocation from "src/hooks/useLocation";
import {
  getPhysicalAddressFromCoordinates,
  removePostalCodes,
} from "src/utils/location.utils";
import { reduxApiRequests } from "src/services/redux/apis";
import { Toast } from "toastify-react-native";
import PDFPreview from "src/components/pdf.preview";
import { Modalize } from "react-native-modalize";

const routes = [
  { key: "personal", title: "Personal Details" },
  { key: "work", title: "Work Details" },
];

function PersonalDetails({
  navigation,
  route,
}: RootStackScreenProps<"ProfileEditScreen">) {
  const {
    email,
    mobile: phone,
    profile,
  } = useAppSelector((state) => state.auth.user);
  const pdfModalRef = useRef<Modalize>(null);
  const { loading, updateProfile } = useUser();
  const { loading: uploading, uploadFile } = useFileUpload();
  const { location } = useLocation();
  const [fullname, setFullname] = useState(
    `${profile.firstname} ${profile.lastname}`,
  );
  const [address, setAddress] = useState(`${profile.address || ""}`);
  const [mobile, setMobile] = useState(`${phone || ""}`);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [locationAddress, setLocationAddress] = useState({
    geolocation: "",
    state: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    if (!profile.address || (profile.address === "" && location?.coords)) {
      getPhysicalAddressFromCoordinates(
        location?.coords.latitude,
        location?.coords.longitude,
        "",
      ).then((addr) => {
        if (addr !== null) {
          const _address = addr?.formatted_address || "Address not found";
          setAddress(_address);
          const _addressArr = _address?.split(",");
          const _city = removePostalCodes(
            _addressArr?.length > 4
              ? `${_addressArr[_addressArr?.length - 4]?.trim()}`
              : `${_addressArr[_addressArr?.length - 3]?.trim()}`,
          );
          setCity(_city);
          setState(`${_addressArr[_addressArr?.length - 2]?.trim()}`);
          setLocationAddress({
            city: _city,
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
  }, [location, profile.address]);

  const [resume, setResume] = useState<DocumentPickerAsset | undefined>();

  const [avatar, setAvatar] = useState<ImagePickerAsset>();

  const doPickImage = async () => {
    const result = await useImagePicker({});
    if (result) {
      setAvatar(result[0]);
    }
  };

  const doSelectCv = async () => {
    const result = await useDocumentPicker({
      type: "application/pdf",
    });
    if (result && result.length > 0) setResume(result[0]);
  };

  const processUpload = async (
    type: "avatar" | "resume",
    file: DocumentPickerAsset | ImagePickerAsset | undefined,
  ) => {
    if (!file || !file.uri) return null;
    const formData = new FormData();
    formData.append(
      "path",
      type === "avatar" ? `photos/${profile.id}` : `resumes/${profile.id}`,
    );
    //@ts-ignore
    formData.append("file", {
      name: CreateFileName(`${file?.uri}`),
      type: GetMediaType(`${file?.uri}`) || `image/jpeg`,
      uri: file?.uri,
    });
    const req = await uploadFile(formData, true);
    if (req.code === 200 && req.data.Location) {
      if (type === "resume") setResume(undefined);
      return req.data.Location;
    }
    return null;
  };

  const doUpdate = async () => {
    if (mobile === "")
      return Toast.show({
        text1: "Mobile number",
        text2: "Please enter your mobile number",
        type: "info",
      });
    const resumeurl = await processUpload("resume", resume);
    const avatarurl = await processUpload("avatar", avatar);
    const names = fullname.split(" ");
    await updateProfile({
      resumeurl: resumeurl !== null ? resumeurl : undefined,
      firstname: names.length > 0 ? names[0] : profile.firstname,
      lastname: names.length > 1 ? names[1] : profile.lastname,
      avatarurl: avatarurl !== null ? avatarurl : undefined,
      state: state,
      country: locationAddress.country,
      geolocation: locationAddress.geolocation,
      city: city,
      address,
      mobile,
    });
  };

  return (
    <ScrollView withKeyboard contentContainerStyle={styles.mainContentStyle}>
      <View style={styles.avatarViewStyle}>
        <ViewableAvatar
          rounded
          source={{
            uri: avatar
              ? avatar.uri
              : profile.avatarurl !== ""
              ? profile.avatarurl
              : undefined,
          }}
          ImageComponent={Image}
          size={fontUtils.h(60)}
        />
        <Icon
          name="pencil"
          type="ionicon"
          color={colorWhite}
          size={fontUtils.h(15)}
          onPress={doPickImage}
          containerStyle={[
            {
              backgroundColor: colorPrimary,
              width: fontUtils.w(25),
              height: fontUtils.w(25),
              borderRadius: fontUtils.w(25),
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: fontUtils.h(0),
              right: fontUtils.w(-5),
            },
          ]}
        />
      </View>
      <Input
        placeholder="Full name"
        label="Full name"
        value={fullname}
        onChangeText={setFullname}
      />
      <Input placeholder="Email" label="Email" value={email} disabled />
      <Input
        placeholder="Phone number"
        label="Phone number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <Input
        placeholder="Location"
        label="Location"
        value={address}
        onChangeText={setAddress}
      />
      <Input label="Enter city" value={city} onChangeText={setCity} />
      <Input label="Enter state" value={state} onChangeText={setState} />
      <Text mb={fontUtils.h(10)}>Upload Resume</Text>
      <View style={[layoutConstants.styles.rowView]}>
        <TouchableOpacity
          style={layoutConstants.styles.uploadBtnStyle}
          onPress={doSelectCv}
        >
          <Octicons name="upload" size={fontUtils.h(15)} color={colorPrimary} />
          <Text mt={fontUtils.h(5)} size={fontUtils.h(10)} align="center">
            Select resume to upload
          </Text>
        </TouchableOpacity>
        {resume && resume.uri ? (
          <TouchableText
            ml={fontUtils.w(20)}
            size={fontUtils.h(10)}
            onPress={() => pdfModalRef.current?.open()}
          >
            Preview selected resume
          </TouchableText>
        ) : null}
      </View>
      <Button
        title={"Save"}
        onPress={doUpdate}
        loading={loading || uploading}
        mt={fontUtils.h(50)}
      />
      <PDFPreview
        modalRef={pdfModalRef}
        source={{
          uri: `${resume?.uri}`,
        }}
        onClose={() => pdfModalRef.current?.close()}
      />
    </ScrollView>
  );
}

function WorkDetails({
  navigation,
  route,
}: RootStackScreenProps<"ProfileEditScreen">) {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.auth.user);
  const { isFetching, data } = useGetProfessionsQuery({
    order: "profession,asc",
  });
  const { loading, updateProfile } = useUser();
  const { loading: uploading, uploadFile } = useFileUpload();
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const [profession, setProfession] = useState(profile.profession || "");
  const [professionX, setProfessionX] = useState(profile.profession || "");
  const [years, setYears] = useState(`${profile.yearsofexperience || 0}`);
  const [bio, setBio] = useState(profile.description || "");
  const doSelectFiles = async () => {
    const result = await useImagePicker({
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });
    if (result && result.length > 0) setImages(result);
  };

  const uploadPortfolio = async () => {
    const urls = [];
    for (const img of images) {
      const formData = new FormData();
      formData.append("path", `portfolio/${profile.id}`);
      //@ts-ignore
      formData.append("file", {
        name: CreateFileName(`${img?.uri}`),
        type: img.mimeType || `image/jpeg`,
        uri: img?.uri,
      });
      const req = await uploadFile(formData, true);
      if (req.code === 200 && req.data.Location) urls.push(req.data.Location);
    }
    setImages([]);
    return urls;
  };

  const doUpdate = async () => {
    const portfoliourls = await uploadPortfolio();
    await updateProfile({
      description: bio.length > 0 ? bio : profile.description,
      yearsofexperience: Number(years) > 0 ? Number(years) : undefined,
      profession:
        professionX.trim() !== ""
          ? professionX.trim()
          : profession.length > 0
          ? profession
          : undefined,
      portfoliourls:
        portfoliourls.length > 0 ? portfoliourls.toString() : undefined,
    });
    if (portfoliourls.length > 0)
      dispatch(
        reduxApiRequests.endpoints.getPortfolio.initiate(
          {
            //@ts-ignore
            profileid: profile.id,
          },
          {
            forceRefetch: true,
            subscribe: true,
          },
        ),
      );
  };

  return (
    <ScrollView withKeyboard contentContainerStyle={styles.mainContentStyle}>
      <Text mb={fontUtils.h(10)}>Profession</Text>
      <SelectInput
        items={
          //@ts-ignore
          [
            ...data?.data,
            {
              profession: "Others",
              id: "others",
            },
          ] || []
        }
        loading={isFetching}
        schema={{
          label: "profession",
          value: "profession",
          id: "profession",
        }}
        itemKey="profession"
        placeholder="Profession"
        label={"Profession & Services"}
        value={profession}
        onSelectItem={(e: any) => setProfession(e.profession)}
        wrapperStyle={styles.selectWrapperStyle}
        listMode={Platform.OS === "android" ? "MODAL" : undefined}
        searchable
        modalContentContainerStyle={{
          paddingVertical: fontUtils.h(60),
        }}
      />
      {profession.toLowerCase() === "others" ? (
        <Input
          label="Can't find profession? Add yours"
          value={professionX}
          onChangeText={setProfessionX}
        />
      ) : null}
      <Input
        label="Years of experience"
        value={years}
        onChangeText={setYears}
        keyboardType="number-pad"
      />
      <Input
        placeholder="Bio"
        label="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        inputHeight={fontUtils.h(80)}
      />
      <Text mb={fontUtils.h(10)}>Portfolio</Text>
      <View style={[layoutConstants.styles.rowView]}>
        <TouchableOpacity
          style={layoutConstants.styles.uploadBtnStyle}
          onPress={doSelectFiles}
        >
          <Octicons name="upload" size={fontUtils.h(15)} color={colorPrimary} />
          <Text mt={fontUtils.h(5)} size={fontUtils.h(10)} align="center">
            Select images to upload
          </Text>
        </TouchableOpacity>
        {images.length > 0 ? (
          <Text ml={fontUtils.w(20)} size={fontUtils.h(10)}>
            {`${images.length} file(s) selected`}
          </Text>
        ) : null}
      </View>
      <Button
        title={"Save"}
        onPress={doUpdate}
        loading={loading || uploading}
        mt={fontUtils.h(50)}
      />
    </ScrollView>
  );
}

export default function ProfileEditScreen({
  navigation,
  route,
}: RootStackScreenProps<"ProfileEditScreen">) {
  const { theme } = useAppTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.headerStyle}>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[layoutConstants.styles.rowView]}
          >
            <Ionicons
              name="chevron-back"
              size={fontUtils.h(20)}
              color={colorWhite}
            />
            <Text ml={fontUtils.w(5)} size={fontUtils.h(12)} color={colorWhite}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          {/* <Icon
            name="ellipsis-vertical"
            type="ionicon"
            color={colorWhite}
            size={fontUtils.h(20)}
          /> */}
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            indicatorStyle={{
              backgroundColor: colorPrimary,
              height: fontUtils.h(2),
            }}
            activeColor={colorPrimary}
            inactiveColor={"rgba(0, 0, 0, 0.5)"}
            style={{
              backgroundColor: "transparent",
              height: fontUtils.h(40),
              marginTop: fontUtils.h(15),
              // marginBottom: fontUtils.h(20),
            }}
            {...props}
          />
        )}
        renderScene={({ route: tabRoute }) => {
          switch (tabRoute.key) {
            case "personal":
              return <PersonalDetails navigation={navigation} route={route} />;
            default:
              return <WorkDetails navigation={navigation} route={route} />;
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headerStyle: {
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
    backgroundColor: colorPrimary,
    height: fontUtils.h(100),
    justifyContent: "flex-end",
    paddingBottom: fontUtils.h(20),
  },
  mainContentStyle: {
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
    paddingTop: fontUtils.h(20),
    paddingBottom: fontUtils.h(30),
  },
  selectWrapperStyle: {
    marginBottom: fontUtils.h(20),
    zIndex: 3,
  },
  avatarViewStyle: {
    alignSelf: "center",
    marginBottom: fontUtils.h(20),
    marginTop: fontUtils.h(10),
  },
});
