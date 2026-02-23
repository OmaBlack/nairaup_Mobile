import React, { useState } from "react";
import { StyleSheet } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { RootStackScreenProps } from "src/types/navigation.types";
import { Image, SafeAreaView, Text } from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import { Input } from "src/components/inputs.components";
import { useAppTheme } from "src/providers/theme.provider";
import useAuth from "src/hooks/apis/useAuth";

export default function ResetPasswordScreen({
  navigation,
  route,
}: RootStackScreenProps<"ResetPasswordScreen">) {
  const { theme } = useAppTheme();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const { loading, resetPassword } = useAuth();

  const doReset = async () => {
    const req = await resetPassword({
      confirmpassword: confirmPassword,
      password,
    });
    if (req.code === 202) navigation.popTo("LoginScreen");
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
        mt={fontUtils.h(30)}
        mb={fontUtils.h(30)}
        size={fontUtils.h(18)}
      >
        Reset Password
      </Text>
      <Input
        label="Enter Password"
        labelIcon={
          <SimpleLineIcons name="lock" size={fontUtils.h(18)} color="black" />
        }
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        label="Confirm Password"
        labelIcon={
          <SimpleLineIcons name="lock" size={fontUtils.h(18)} color="black" />
        }
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        onSubmitEditing={doReset}
      />

      <Button
        title="Reset Password"
        onPress={doReset}
        loading={loading}
        disabled={confirmPassword === "" || password === ""}
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
  btnIconStyle: {
    height: fontUtils.w(22),
    width: fontUtils.w(22),
    marginRight: fontUtils.w(10),
  },
});
