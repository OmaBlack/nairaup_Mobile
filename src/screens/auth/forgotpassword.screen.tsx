import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableText,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import layoutConstants from "src/constants/layout.constants";
import { colorPrimary } from "src/constants/colors.constants";
import { Input } from "src/components/inputs.components";
import { useAppTheme } from "src/providers/theme.provider";
import useAuth from "src/hooks/apis/useAuth";
import IsEmail from "src/utils/isemail.utils";

export default function ForgotPasswordScreen({
  navigation,
  route,
}: RootStackScreenProps<"ForgotPasswordScreen">) {
  const { theme } = useAppTheme();
  const [username, setUsername] = useState("");
  const { loading, requestOTP } = useAuth();

  const doSubmit = async () => {
    const isEmail = IsEmail(username);
    const req = await requestOTP({
      mobile: !isEmail ? username : undefined,
      email: isEmail ? username : undefined,
      ispasswordreset: true,
    });
    if (req.code === 200)
      navigation.navigate("OTPVerificationScreen", {
        email: username,
        isEmail,
        mobile: username,
        isPasswordReset: true,
      });
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Image
        source={require("src/assets/images/login-banner.jpg")}
        style={styles.bannerStyle}
        contentFit="contain"
      />
      <Text
        fontFamily={fontUtils.manrope_bold}
        mt={fontUtils.h(30)}
        mb={fontUtils.h(30)}
        size={fontUtils.h(18)}
      >
        Reset Your Password
      </Text>
      <Input
        label="Enter Email/Phone Number"
        labelIcon={
          <SimpleLineIcons
            name="envelope"
            size={fontUtils.h(18)}
            color="black"
          />
        }
        value={username}
        onChangeText={setUsername}
        onSubmitEditing={doSubmit}
      />
      <TouchableText
        onPress={() => navigation.popTo("LoginScreen")}
        align="right"
      >
        Back to Login
      </TouchableText>
      <Button
        title="Submit"
        disabled={username === ""}
        onPress={doSubmit}
        loading={loading}
        mb={fontUtils.h(20)}
        mt={fontUtils.h(25)}
      />
      <View
        style={[
          layoutConstants.styles.rowView,
          layoutConstants.styles.justifyCenter,
        ]}
      >
        <Text>New to NairaUp?</Text>
        <TouchableText
          ml={fontUtils.w(5)}
          color={colorPrimary}
          fontFamily={fontUtils.manrope_semibold}
          onPress={() => navigation.navigate("CreateAccountScreen")}
        >
          Sign up
        </TouchableText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerStyle: {
    width: "100%",
    height: fontUtils.h(123),
    borderRadius: fontUtils.r(16),
    marginTop: fontUtils.h(70),
  },
  btnIconStyle: {
    height: fontUtils.w(22),
    width: fontUtils.w(22),
    marginRight: fontUtils.w(10),
  },
});
