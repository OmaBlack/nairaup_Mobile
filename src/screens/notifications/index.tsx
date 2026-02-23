import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView, Text } from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { NotificationItem } from "./components/notification.components";
import {
  useGetNotificationsCountQuery,
  useGetNotificationsQuery,
} from "src/services/redux/apis";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { NotificationObjectType } from "src/types/notifications.types";
import { useAppSelector } from "src/hooks/useReduxHooks";

export default function NotificationsScreen({
  navigation,
  route,
}: RootStackScreenProps<"NotificationsTabNavigator">) {
  const { theme } = useAppTheme();
  const { profile } = useAppSelector((state) => state.auth.user);

  const { data: countData } = useGetNotificationsCountQuery({
    status: "pending",
    //@ts-ignore
    profileid: profile.id,
  });

  const { data, isFetching, refetch } = useGetNotificationsQuery({
    //@ts-ignore
    profileid: profile.id,
  });

  const renderItem = useCallback(
    ({ item, index }: { item: NotificationObjectType; index: number }) => (
      <NotificationItem {...item} />
    ),
    [],
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <Text
        mt={fontUtils.h(10)}
        mb={fontUtils.h(25)}
        fontFamily={fontUtils.manrope_medium}
      >
        {`(${countData?.data?.count ?? 0}) new notifications`}
      </Text>
      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        refreshControl={
          <AppRefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
