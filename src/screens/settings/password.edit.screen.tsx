import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import { Input } from "src/components/inputs.components";
import { Button } from "src/components/buttons.components";
import fontUtils from "src/utils/font.utils";
import useAuth from "src/hooks/apis/useAuth";

export default function PasswordEditScreen({
  navigation,
  route,
}: RootStackScreenProps<"PasswordEditScreen">) {
  const { theme } = useAppTheme();
  const { loading, changePassword } = useAuth();

  const [confirmpassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [currentpassword, setCurrentpassword] = useState("");

  const doUpdate = async () => {
    const req = await changePassword({
      confirmpassword,
      password,
      currentpassword,
    });
    if (req.code === 200) {
      setConfirmPassword("");
      setCurrentpassword("");
      setPassword("");
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Input
        label="Enter old password"
        value={currentpassword}
        onChangeText={setCurrentpassword}
        secureTextEntry
      />
      <Input
        label="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        label="Confirm new password"
        value={confirmpassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title={"Update"}
        onPress={doUpdate}
        loading={loading}
        disabled={
          password === "" || confirmpassword === "" || currentpassword === ""
        }
        wrapperStyle={{
          width: fontUtils.w(200),
          alignSelf: "center",
          marginTop: fontUtils.h(30),
        }}
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
