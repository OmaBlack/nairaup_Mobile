import React from "react";
import { Alert, StyleSheet } from "react-native";
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
import { colorDanger } from "src/constants/colors.constants";
import useUser from "src/hooks/apis/useUser";

export default function AccountManagementScreen({
  navigation,
  route,
}: RootStackScreenProps<"AccountManagementScreen">) {
  const { theme } = useAppTheme();
  const { deleteMyAccount } = useUser();

  const doDeleteAccount = () =>
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?\nThis action can't be undone and your account will be deleted immeidately.",
      [
        {
          text: "Cancel",
          isPreferred: true,
        },
        {
          text: "Yes, delete",
          style: "destructive",
          onPress: async () => await deleteMyAccount(),
        },
      ],
    );

  return (
    <SafeAreaView style={[styles.container]}>
      {[
        {
          label: "Delete my account",
          icon: (
            <Ionicons
              name="trash-bin"
              color={colorDanger}
              size={fontUtils.h(12)}
            />
          ),
          onPress: doDeleteAccount,
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
            <Text size={fontUtils.h(10)} ml={fontUtils.w(10)}>
              {menu.label}
            </Text>
          </View>
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
