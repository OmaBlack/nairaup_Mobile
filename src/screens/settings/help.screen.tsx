import React from "react";
import { Linking, StyleSheet } from "react-native";
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

export default function HelpCenterScreen({
  navigation,
  route,
}: RootStackScreenProps<"HelpCenterScreen">) {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container]}>
      {[
        {
          label: "+1 (757) 915 2206",
          icon: <Ionicons name="logo-whatsapp" size={fontUtils.h(20)} />,
          onPress: async () =>
            Linking.openURL(
              "https://api.whatsapp.com/send/?phone=17579152206&text&type=phone_number&app_absent=0",
            ),
        },
        {
          label: "+234 706 523 4648",
          icon: <Ionicons name="logo-whatsapp" size={fontUtils.h(20)} />,
          onPress: async () =>
            Linking.openURL(
              "https://api.whatsapp.com/send/?phone=2347065234648&text&type=phone_number&app_absent=0",
            ),
        },
        {
          label: "info@nairaup.com",
          icon: <Ionicons name="mail" size={fontUtils.h(20)} />,
          onPress: () => Linking.openURL("mailto:/info@nairaup.com"),
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
