import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView, Text } from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { ChatListItem } from "./components/chat.components";
import { useGetConnectionsQuery } from "src/services/redux/apis";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { useAppSelector } from "src/hooks/useReduxHooks";

export default function ChatListScreen({
  navigation,
  route,
}: RootStackScreenProps<"ChatListScreen">) {
  const { profile } = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetConnectionsQuery({
    //@ts-ignore
    profileid: profile.id,
  });

  const renderItem = useCallback(
    ({ item, index }: any) => <ChatListItem data={item} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[layoutConstants.styles.rowView]}>
        <Text mt={fontUtils.h(10)} mb={fontUtils.h(20)}>
          All Messages
        </Text>
      </View>
      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        refreshControl={
          <AppRefreshControl refreshing={isLoading} onRefresh={refetch} />
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
