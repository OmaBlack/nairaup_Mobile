import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { usePage } from "src/providers/page.provider";
import ApartmentsExploreScreen from "./apartments.explore";
import ServicesExploreScreen from "./services.explore";
import HotelsExploreScreen from "./hotels.explore";
import JobsScreen from "./jobs.explore";

export default function ExploreTabScreen({
  navigation,
  route,
}: RootStackScreenProps<"ExploreTabNavigator">) {
  const { page } = usePage();

  switch (page) {
    case "apartments":
      return <ApartmentsExploreScreen navigation={navigation} route={route} />;
    case "services":
      return <ServicesExploreScreen navigation={navigation} route={route} />;
    case "hotels":
      return <HotelsExploreScreen navigation={navigation} route={route} />;
    case "jobs":
      return <JobsScreen navigation={navigation} route={route} />;
    default:
      return <ApartmentsExploreScreen navigation={navigation} route={route} />;
  }
}

const styles = StyleSheet.create({});
