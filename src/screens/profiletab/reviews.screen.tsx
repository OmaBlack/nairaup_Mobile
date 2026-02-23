import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import { useAppDispatch, useAppSelector } from "src/hooks/useReduxHooks";
import { logout } from "src/services/redux/slices/auth";
import ReviewTabScreen from "../services/tabs/reviews.tab";

export default function ReviewsScreen({
  navigation,
  route,
}: RootStackScreenProps<"ReviewsScreen">) {
  const { theme } = useAppTheme();
  const { profile } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const doLogout = () => {
    dispatch(logout());
  };
  return (
    <SafeAreaView style={[styles.container]}>
      <ReviewTabScreen profileid={profile.id} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
