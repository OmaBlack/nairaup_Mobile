import React, { useCallback, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView, Text, TouchableOpacity } from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { ChatListItem } from "./components/chat.components";
import { useGetConnectionsQuery, useArchiveConnectionMutation } from "src/services/redux/apis";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { colorPrimary } from "src/constants/colors.constants";

export default function ChatListScreen({
  navigation,
  route,
}: RootStackScreenProps<"ChatListScreen">) {
  const { profile } = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [archiveConnection] = useArchiveConnectionMutation();

  const { data: activeData, isLoading: activeLoading, refetch: refetchActive } = useGetConnectionsQuery({
    //@ts-ignore
    profileid: profile.id,
    deleted: 0,
  });

  const { data: archivedData, isLoading: archivedLoading, refetch: refetchArchived } = useGetConnectionsQuery({
    //@ts-ignore
    profileid: profile.id,
    deleted: 1,
  });

  const isLoading = activeTab === "active" ? activeLoading : archivedLoading;
  const currentData = activeTab === "active" ? activeData : archivedData;
  const currentRefetch = activeTab === "active" ? refetchActive : refetchArchived;

  const handleArchiveChat = useCallback(
    async (connectionString: string) => {
      try {
        const result = await archiveConnection({ connectionstring: connectionString }).unwrap();
        
        if (result?.code === 200) {
          Alert.alert("Success", "Message archived successfully", [
            { text: "OK" },
          ]);
        } else {
          Alert.alert("Info", `Archive response code: ${result?.code}`, [
            { text: "OK" },
          ]);
        }
      } catch (error: any) {
        Alert.alert("Error", "Failed to archive message. Please try again.", [
          { text: "OK" },
        ]);
      } finally {
        setTimeout(async () => {
          try {
            await refetchActive();
          } catch (err) {
            // handle error silently
          }

          try {
            await refetchArchived();
          } catch (err) {
            // handle error silently
          }
        }, 2000);
      }
    },
    [archiveConnection, refetchActive, refetchArchived],
  );

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <ChatListItem data={item} onArchive={handleArchiveChat} />
    ),
    [handleArchiveChat],
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text align="center" size={fontUtils.h(13)}>
        {activeTab === "active" ? "No active messages" : "No archived messages"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Header */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            fontFamily={fontUtils.manrope_semibold}
            size={fontUtils.h(13)}
            style={{ color: activeTab === "active" ? colorPrimary : "gray" }}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "archived" && styles.activeTab]}
          onPress={() => setActiveTab("archived")}
        >
          <Text
            fontFamily={fontUtils.manrope_semibold}
            size={fontUtils.h(13)}
            style={{ color: activeTab === "archived" ? colorPrimary : "gray" }}
          >
            Archived
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentData?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.connectionstring?.toString()}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <AppRefreshControl refreshing={isLoading} onRefresh={currentRefetch} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: fontUtils.w(16),
  },
  tab: {
    paddingVertical: fontUtils.h(12),
    paddingHorizontal: fontUtils.w(16),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colorPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
