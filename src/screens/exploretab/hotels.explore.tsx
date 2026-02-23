import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import HotelsTabScreen from "../hometab/tabs/hotels.tab";

export default function HotelsExploreScreen({
  navigation,
  route,
}: RootStackScreenProps<"ExploreTabNavigator">) {
  return (
    <SafeAreaView style={styles.container}>
      <HotelsTabScreen
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
