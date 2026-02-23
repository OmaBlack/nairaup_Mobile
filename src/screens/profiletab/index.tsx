import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ViewableAvatar,
} from "src/components/themed.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import fontUtils, { deviceHeight } from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScreenHeader } from "src/components/headers.components";
import { TabBar, TabView } from "react-native-tab-view";
import PortfolioTabScreen from "../services/tabs/portfolio.tab";
import ReviewTabScreen from "../services/tabs/reviews.tab";
import ProjectTabScreen from "../services/tabs/projects.tab";
import { RightComponentMenu } from "./components/header.component";
import { Image } from "expo-image";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { CapitalizeFirstLetter } from "src/utils/app.utils";

const routes = [
  { key: "portfolio", title: "My Portfolio" },
  { key: "reviews", title: "Reviews & Ratings" },
  { key: "projects", title: "Completed Projects" },
];

export default function ProfileTabScreen({
  navigation,
  route,
}: RootStackScreenProps<"ProfileTabNavigator">) {
  const { profile } = useAppSelector((state) => state.auth.user);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ScreenHeader
          title={""}
          titleColor={colorWhite}
          containerStyle={{
            backgroundColor: colorPrimary,
            height: fontUtils.h(110),
            paddingBottom: fontUtils.h(30),
          }}
          rightComponent={<RightComponentMenu />}
        />
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
            styles.headerViewStyle,
          ]}
        >
          <ViewableAvatar
            title={
              profile.avatarurl === ""
                ? `${profile.firstname.substring(
                    0,
                    1,
                  )}${profile.lastname.substring(0, 1)}`
                : undefined
            }
            rounded
            source={
              profile.avatarurl !== ""
                ? {
                    uri: profile.avatarurl,
                  }
                : undefined
            }
            ImageComponent={Image}
            size={fontUtils.h(45)}
            containerStyle={styles.avatarContainerStyle}
          />
          {/* <View style={styles.priceViewStyle}>
            <Text fontFamily={fontUtils.manrope_bold}>N10,000</Text>
            <Text size={fontUtils.h(8)}>Average price</Text>
          </View> */}
        </View>
        <View style={styles.contentStyle}>
          <View style={[layoutConstants.styles.rowView]}>
            <Text mr={fontUtils.h(10)} fontFamily={fontUtils.manrope_semibold}>
              {`${profile.firstname} ${profile.lastname}`}
            </Text>
            <MaterialIcons
              name="verified"
              size={fontUtils.h(15)}
              color="#F5D066"
            />
          </View>
          <Text fontFamily={fontUtils.manrope_medium} mt={fontUtils.h(10)}>
            {profile.profession ?? "Profession"}
          </Text>
          <Text size={fontUtils.h(12)} mt={fontUtils.h(5)}>
            {profile.description || "NA"}
          </Text>
          <View
            style={[
              layoutConstants.styles.rowView,
              // layoutConstants.styles.justifyContentBetween,
              styles.summaryCardView,
            ]}
          >
            {[
              {
                label: `${CapitalizeFirstLetter(
                  profile.city ?? "",
                )}, ${CapitalizeFirstLetter(profile.state ?? "")}`,
                value: (
                  <Ionicons
                    name="location"
                    color="#F5D066"
                    size={fontUtils.h(16)}
                  />
                ),
                style: {
                  borderRightWidth: 1,
                  borderColor: colorWhite,
                },
              },
              {
                label: "Years of Experience",
                value:
                  profile?.yearsofexperience && profile?.yearsofexperience > 0
                    ? profile.yearsofexperience
                    : "NA",
                style: {
                  marginHorizontal: fontUtils.w(5),
                },
              },
              {
                label: `${profile.averagerating ?? 3}/5 Ratings`,
                value: (
                  <Ionicons
                    name="star"
                    size={fontUtils.h(15)}
                    color="#F5D066"
                  />
                ),
                style: {
                  borderLeftWidth: 1,
                  borderColor: colorWhite,
                },
              },
            ].map((s) => (
              <View key={s.label} style={[styles.summaryItemStyle, s.style]}>
                <Text
                  color={colorWhite}
                  fontFamily={fontUtils.manrope_medium}
                  mb={fontUtils.h(10)}
                >
                  {s.value}
                </Text>
                <Text size={fontUtils.h(10)} color={colorWhite}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <TabView
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              indicatorStyle={{
                backgroundColor: colorPrimary,
                height: fontUtils.h(2),
              }}
              activeColor={colorPrimary}
              inactiveColor={"rgba(0, 0, 0, 0.5)"}
              style={{
                backgroundColor: "transparent",
                height: fontUtils.h(40),
                marginTop: fontUtils.h(5),
              }}
              {...props}
            />
          )}
          renderScene={({ route: tabRoute }) => {
            switch (tabRoute.key) {
              case "portfolio":
                return <PortfolioTabScreen />;
              case "reviews":
                return <ReviewTabScreen profileid={profile.id} />;
              default:
                return <ProjectTabScreen />;
            }
          }}
          style={{ height: deviceHeight - fontUtils.h(150) }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  contentStyle: {
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  headerViewStyle: {
    alignItems: "flex-end",
    marginTop: fontUtils.h(-20),
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
    marginBottom: fontUtils.h(15),
  },
  avatarContainerStyle: {
    backgroundColor: "#293AA6",
  },
  summaryCardView: {
    backgroundColor: colorPrimary,
    borderRadius: fontUtils.r(12),
    marginTop: fontUtils.h(25),
    paddingVertical: fontUtils.h(12),
  },
  summaryItemStyle: {
    flex: 1,
    alignItems: "center",
  },
  priceViewStyle: {
    alignItems: "center",
    marginBottom: fontUtils.h(-20),
    borderWidth: 1,
    borderColor: colorPrimary,
    borderRadius: fontUtils.r(20),
    paddingHorizontal: fontUtils.w(15),
    paddingVertical: fontUtils.h(5),
  },
});
