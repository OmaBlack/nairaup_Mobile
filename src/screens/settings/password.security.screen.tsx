import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import fontUtils from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import { Ionicons } from "@expo/vector-icons";
import PasswordSecurityIcon from "src/components/svgs/password.security";

export default function PasswordSecurityScreen({
  navigation,
  route,
}: RootStackScreenProps<"PasswordSecurityScreen">) {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container]}>
      {[
        {
          label: "Change Password",
          icon: <PasswordSecurityIcon />,
          onPress: () => navigation.navigate("PasswordEditScreen"),
        },
        {
          label: "Change Security PIN",
          icon: <PasswordSecurityIcon />,
          onPress: () => navigation.navigate("PinEditScreen"),
        },
        {
          label: "Account Management",
          icon: <PasswordSecurityIcon />,
          onPress: () => navigation.navigate("AccountManagementScreen"),
        },
      ].map((menu) => (
        <TouchableOpacity
          onPress={menu.onPress}
          key={menu.label}
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
            styles.menuViewStyle,
          ]}
        >
          <View style={[layoutConstants.styles.rowView]}>
            {menu.icon}
            <Text ml={fontUtils.w(10)}>{menu.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={fontUtils.h(20)} />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuViewStyle: {
    marginBottom: fontUtils.h(10),
    backgroundColor: "#FAFCFF",
    height: fontUtils.h(50),
  },
});
