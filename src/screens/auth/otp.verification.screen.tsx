import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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
import { useAppTheme } from "src/providers/theme.provider";
import OtpInput from "src/components/otpinputs.components";
import useAuth from "src/hooks/apis/useAuth";

export default function OTPVerificationScreen({
  navigation,
  route,
}: RootStackScreenProps<"OTPVerificationScreen">) {
  const { theme } = useAppTheme();
  const email = route.params.email;
  const mobile = route.params.mobile;
  const isEmail = route.params.isEmail;
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(0);

  const { loading, requestOTP, verifyOTP } = useAuth();

  useEffect(() => {
    startCount(60);
  }, []);

  const startCount = (seconds: number) => {
    let x = setInterval(function () {
      seconds = seconds - 1;
      if (seconds <= 0) {
        clearInterval(x);
      }
      setCounter(seconds);
    }, 1000);
  };

  const doRequestNewOTP = async () => {
    await requestOTP({
      email: isEmail ? email : undefined,
      mobile: !isEmail ? mobile : undefined,
      ispasswordreset: route.params.isPasswordReset,
    });
    startCount(60);
  };

  useEffect(() => {
    if (otp.length === 4) doVerify();
  }, [otp]);

  const doVerify = async () => {
    const req = await verifyOTP({
      otp,
      email: route.params.isEmail ? route.params.email : undefined,
      mobile: !route.params.isEmail ? route.params.mobile : undefined,
    });
    if (req.code === 200)
      navigation.navigate(
        route.params.isPasswordReset
          ? "ResetPasswordScreen"
          : "AccountSuccessScreen",
      );
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Image
        source={require("src/assets/images/phone-finger-verification.png")}
        style={styles.bannerStyle}
        contentFit="contain"
      />
      <Text
        fontFamily={fontUtils.manrope_bold}
        mt={fontUtils.h(20)}
        mb={fontUtils.h(5)}
        size={fontUtils.h(18)}
      >
        OTP Verification
      </Text>
      <Text mb={fontUtils.h(30)}>
        {`An OTP code has been sent to your email ${
          email ? email : mobile
        } Kindly input it
        in the fields below`}
      </Text>
      <OtpInput value={otp} onChange={setOtp} />
      <View
        style={[
          layoutConstants.styles.rowView,
          layoutConstants.styles.justifyCenter,
          {
            marginTop: fontUtils.h(50),
            marginBottom: fontUtils.h(60),
          },
        ]}
      >
        <Text>
          {counter > 0
            ? `Request new code in ${counter}s`
            : `Click here if you didn't receive any OTP?`}
        </Text>
        {counter < 1 ? (
          <TouchableText
            color={colorPrimary}
            fontFamily={fontUtils.manrope_semibold}
            onPress={doRequestNewOTP}
          >
            Resend
          </TouchableText>
        ) : null}
      </View>
      <Button
        title="Confirm"
        onPress={doVerify}
        loading={loading}
        disabled={otp.length < 4}
        mb={fontUtils.h(20)}
        mt={fontUtils.h(25)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerStyle: {
    width: fontUtils.w(276 * 0.9),
    height: fontUtils.w(255 * 0.9),
    alignSelf: "center",
  },
});
