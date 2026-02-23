import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import ApartmentsTabScreen from "../hometab/tabs/apartments.tab";

export default function ApartmentsExploreScreen({
  navigation,
  route,
}: RootStackScreenProps<"ExploreTabNavigator">) {
  return (
    <SafeAreaView style={styles.container}>
      <ApartmentsTabScreen
        navigation={navigation}
        route={route}
        withSearch={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
