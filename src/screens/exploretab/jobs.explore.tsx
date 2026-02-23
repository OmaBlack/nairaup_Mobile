import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import JobsTabScreen from "../hometab/tabs/job.tab";

export default function JobsScreen({
  navigation,
  route,
}: RootStackScreenProps<"ExploreTabNavigator">) {
  return (
    <SafeAreaView style={styles.container}>
      <JobsTabScreen navigation={navigation} route={route} withSearch={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
