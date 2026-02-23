import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import { FlatList } from "react-native-gesture-handler";
import { JobListingHorizontalItem } from "src/components/jobs.components";
import fontUtils from "src/utils/font.utils";
import { useGetJobsApplicationsQuery } from "src/services/redux/apis";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { JobObjectType } from "src/types/jobs.types";

export default function AppliedJobsScreen({
  navigation,
  route,
}: RootStackScreenProps<"AppliedJobsScreen">) {
  const { theme } = useAppTheme();
  const { id } = useAppSelector((state) => state.auth.user.profile);
  const { data, isFetching, refetch } = useGetJobsApplicationsQuery({
    profileid: `${id}`,
  });

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: {
        jobpost: JobObjectType;
      };
      index: number;
    }) => {
      const job = item?.jobpost;
      return <JobListingHorizontalItem {...job} />;
    },
    [],
  );

  return (
    <SafeAreaView style={[styles.container]}>
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
    paddingTop: fontUtils.h(20),
  },
});
