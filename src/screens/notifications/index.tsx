import React, { useCallback } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { SafeAreaView, Text } from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { NotificationItem } from "./components/notification.components";
import {
  useGetNotificationsCountQuery,
  useGetNotificationsQuery,
  useArchiveNotificationMutation,
} from "src/services/redux/apis";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { NotificationObjectType } from "src/types/notifications.types";
import { useAppSelector } from "src/hooks/useReduxHooks";

export default function NotificationsScreen() {
  const { theme } = useAppTheme();
  const { profile } = useAppSelector((state) => state.auth.user);
  const [archiveNotification] = useArchiveNotificationMutation();

  const { data: countData } = useGetNotificationsCountQuery({
    status: "pending",
    profileid: `${profile.id}`,
  });

  const { data, isFetching, refetch, isError, error } = useGetNotificationsQuery({
    profileid: `${profile.id}`,
  });

  const notifications: NotificationObjectType[] = data?.data || [];

  const handleArchiveNotification = useCallback(
    async (notificationId: string) => {
      try {
        const result = await archiveNotification({ id: notificationId }).unwrap();
        
        if (result?.code === 200) {
          Alert.alert("Success", "Notification archived successfully", [
            { text: "OK" },
          ]);
        } else {
          Alert.alert("Info", `Archive response code: ${result?.code}`, [
            { text: "OK" },
          ]);
        }
      } catch (error: any) {
        Alert.alert("Error", "Failed to archive notification. Please try again.", [
          { text: "OK" },
        ]);
      } finally {
        // Refetch notifications after a short delay
        setTimeout(() => {
          refetch();
        }, 500);
      }
    },
    [archiveNotification, refetch],
  );

  const renderItem = useCallback(
    ({ item }: { item: NotificationObjectType }) => (
      <NotificationItem data={item} onArchive={handleArchiveNotification} />
    ),
    [handleArchiveNotification],
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text align="center" size={fontUtils.h(13)}>
        No notifications yet
      </Text>
    </View>
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
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <AppRefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: fontUtils.w(16),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: fontUtils.h(80),
  },
});
