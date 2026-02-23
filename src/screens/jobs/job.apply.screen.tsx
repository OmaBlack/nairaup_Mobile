import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "src/components/themed.components";
import { Button } from "src/components/buttons.components";
import { Input } from "src/components/inputs.components";
import fontUtils from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import { Octicons } from "@expo/vector-icons";
import { colorPrimary } from "src/constants/colors.constants";
import useDocumentPicker from "src/hooks/useDocumentPicker";
import { ResponseModal } from "./components/modal.components";
import { Modalize } from "react-native-modalize";
import { useAppDispatch, useAppSelector } from "src/hooks/useReduxHooks";
import { DocumentPickerAsset } from "expo-document-picker";
import useJobs from "src/hooks/apis/useJobs";
import { useFileUpload } from "src/hooks/apis/useFIle";
import { Toast } from "toastify-react-native";
import { CreateFileName, GetMediaType } from "src/utils/file.utils";
import { updateUserProfileData } from "src/services/redux/slices/auth";
import { useGetJobQuery } from "src/services/redux/apis/unauth.api.requests";

export default function JobApplyScreen({
  navigation,
  route,
}: RootStackScreenProps<"JobApplyScreen">) {
  const jobId = route.params.id;
  const dispatch = useAppDispatch();
  const { data: jobData, isFetching } = useGetJobQuery(jobId);
  const modalRef = useRef<Modalize>(null);
  const {
    profile,
    email: userEmail,
    mobile: userMobile,
  } = useAppSelector((state) => state.auth.user);
  const [firstName, setFirstName] = useState(`${profile.firstname}`);
  const [lastName, setLastName] = useState(`${profile.lastname}`);
  const [email, setEmail] = useState(userEmail);
  //@ts-ignore
  const [mobile, setMobile] = useState(userMobile || profile.mobile);
  const [address, setAddress] = useState(`${profile.address ?? ""}`);
  const [resume, setResume] = useState<DocumentPickerAsset | null>(null);

  const { loading, applyForJob } = useJobs();
  const { uploadFile, loading: uploading } = useFileUpload();

  const doSelectCv = async () => {
    const result = await useDocumentPicker();
    if (result && result.length > 0) setResume(result[0]);
  };

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("path", `jobs-resume/${jobId}`);
    //@ts-ignore
    formData.append("file", {
      //@ts-ignore
      name: CreateFileName(`${resume.uri}`),
      //@ts-ignore
      type: GetMediaType(`${resume?.uri}`) || `application/pdf`,
      //@ts-ignore
      uri: resume.uri,
    });
    const req = await uploadFile(formData, true);
    if (req.code === 200 && req.data.Location) return req.data.Location;
    else
      Toast.show({
        text1: "Resume",
        text2: "Unable to upload resume",
        type: "error",
      });
    return null;
  };

  const doApply = async () => {
    const resumeurl = await uploadResume();
    const req = await applyForJob({
      address,
      email,
      firstname: firstName,
      jobid: jobId,
      lastname: lastName,
      mobile,
      resumeurl,
    });
    if (req.code === 201) {
      if (userMobile === "" || userMobile === null)
        dispatch(
          updateUserProfileData({
            ...profile,
            mobile,
          }),
        );
      modalRef.current?.open();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Input
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <Input label="Last Name" value={lastName} onChangeText={setLastName} />
        <Input label="Email" value={email} onChangeText={setEmail} />
        <Input label="Phone Number" value={mobile} onChangeText={setMobile} />
        <Input label="Location" value={address} onChangeText={setAddress} />
        <Text mb={fontUtils.h(10)}>Upload CV</Text>
        <View style={[layoutConstants.styles.rowView]}>
          <TouchableOpacity
            style={layoutConstants.styles.uploadBtnStyle}
            onPress={doSelectCv}
          >
            <Octicons
              name="upload"
              size={fontUtils.h(15)}
              color={colorPrimary}
            />
            <Text mt={fontUtils.h(5)} size={fontUtils.h(10)}>
              Upload resume
            </Text>
          </TouchableOpacity>
          {resume?.name ? (
            <Text ml={fontUtils.w(20)} size={fontUtils.h(10)}>
              1 file selected
            </Text>
          ) : null}
        </View>
      </ScrollView>
      <Button
        title={"Submit application"}
        onPress={doApply}
        loading={loading || uploading}
        disabled={
          resume === null ||
          resume?.name === "" ||
          firstName === "" ||
          lastName === "" ||
          email === "" ||
          mobile === ""
        }
      />
      <ResponseModal
        message={`Application submitted to ${jobData?.data?.company}`}
        modalRef={modalRef}
        onClosed={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: fontUtils.h(20),
  },
});
