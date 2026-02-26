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
import ProfileEditIcon from "src/components/svgs/profile.edit";
import ItemSavedIcon from "src/components/svgs/item.saved";
import InvoiceIcon from "src/components/svgs/invoice";
import PasswordSecurityIcon from "src/components/svgs/password.security";
import HelpCenterIcon from "src/components/svgs/help.center";
import LogoutIcon from "src/components/svgs/logout";
import { useAppDispatch } from "src/hooks/useReduxHooks";
import { logout } from "src/services/redux/slices/auth";

export default function SettingsScreen({
  navigation,
  route,
}: RootStackScreenProps<"SettingsScreen">) {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const doLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Text
        mt={fontUtils.h(10)}
        mb={fontUtils.h(25)}
        fontFamily={fontUtils.manrope_medium}
      >
        All Settings
      </Text>
      {[
        {
          label: "Edit Profile",
          icon: <ProfileEditIcon />,
          onPress: () => navigation.navigate("ProfileEditScreen"),
        },
        {
          label: "Saved Items",
          icon: <ItemSavedIcon />,
          onPress: () => navigation.navigate("SavedItemsScreen"),
        },
        {
          label: "Purchased Items",
          icon: <InvoiceIcon />,
          onPress: () => navigation.navigate("AllPurchasesScreen"),
        },
        {
          label: "All Jobs",
          icon: <InvoiceIcon />,
          onPress: () => navigation.navigate("AllJobsScreen"),
        },
        {
          label: "Applied Jobs",
          icon: <InvoiceIcon />,
          onPress: () => navigation.navigate("AppliedJobsScreen"),
        },
        {
          label: "Saved Jobs",
          icon: <InvoiceIcon />,
          onPress: () => navigation.navigate("SavedJobsScreen"),
        },
        {
          label: "Password and Security",
          icon: <PasswordSecurityIcon />,
          onPress: () => navigation.navigate("PasswordSecurityScreen"),
        },
        {
          label: "Help Center",
          icon: <HelpCenterIcon />,
          onPress: () => navigation.navigate("HelpCenterScreen"),
        },
        {
          label: "Log Out",
          icon: <LogoutIcon />,
          onPress: doLogout,
        },
        // {
        //   label: "Delete my account",
        //   icon: (
        //     <Ionicons
        //       name="trash-bin"
        //       color={colorDanger}
        //       size={fontUtils.h(20)}
        //     />
        //   ),
        //   onPress: doDeleteAccount,
        // },
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
