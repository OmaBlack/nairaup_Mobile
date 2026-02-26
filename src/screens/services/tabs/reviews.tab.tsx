import React, { useCallback } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { ReviewItem } from "../components/review.components";
import ListEmpty from "src/components/list.empty";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { useGetReviewsQuery } from "src/services/redux/apis";
import { AppRefreshControl } from "src/components/refreshcontrol.component";

export default function ReviewTabScreen({
  profileid,
  onScroll,
}: {
  profileid: number;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const renderItem = useCallback(
    ({ item, index }: any) => <ReviewItem {...item} />,
    [],
  );

  const { isLoading, data, refetch } = useGetReviewsQuery({
    //@ts-ignore
    recipientid: profileid,
  });

  return (
    <View style={styles.container}>
      <Text
        ml={fontUtils.w(10)}
        fontFamily={fontUtils.manrope_medium}
        mb={fontUtils.h(10)}
      >
        {`${data?.meta?.totalItems} Reviews and Ratings`}
      </Text>
      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        refreshControl={
          <AppRefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <ListEmpty note="You currently do not have any reviews yet. All reviews will appear here." />
        }
        onScroll={onScroll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: fontUtils.w(8),
    paddingTop: fontUtils.h(30),
  },
});
