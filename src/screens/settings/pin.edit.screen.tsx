import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import { Input } from "src/components/inputs.components";
import { Button } from "src/components/buttons.components";
import fontUtils from "src/utils/font.utils";
import useAuth from "src/hooks/apis/useAuth";

export default function PinEditScreen({
  navigation,
  route,
}: RootStackScreenProps<"PinEditScreen">) {
  const { theme } = useAppTheme();
  const { loading, updatePIN } = useAuth();

  const [password, setPassword] = useState("");
  const [pin, setPIN] = useState("");

  const doUpdate = async () => {
    const req = await updatePIN({
      password,
      pin,
    });
    if (req.code === 200) {
      setPIN("");
      setPassword("");
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Input
        label="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        label="Create PIN"
        value={pin}
        onChangeText={setPIN}
        secureTextEntry
      />
      <Button
        title={"Update"}
        onPress={doUpdate}
        loading={loading}
        disabled={password === "" || pin === ""}
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
