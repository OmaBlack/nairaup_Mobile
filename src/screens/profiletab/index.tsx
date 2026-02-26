import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  ScrollView as RNScrollView,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ViewableAvatar,
} from "src/components/themed.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScreenHeader } from "src/components/headers.components";
import PortfolioTabScreen from "../services/tabs/portfolio.tab";
import ReviewTabScreen from "../services/tabs/reviews.tab";
import ProjectTabScreen from "../services/tabs/projects.tab";
import { RightComponentMenu } from "./components/header.component";
import { Image } from "expo-image";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { CapitalizeFirstLetter } from "src/utils/app.utils";
import { FlatList, ScrollView } from "react-native-gesture-handler";

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
  const [slide, setSlide] = useState(0);
  const scrollViewRef = useRef<RNScrollView>(null);

  const onScrollTab = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = e.nativeEvent.contentOffset.y;
    // if (position < 300)
    scrollViewRef.current?.scrollTo({
      y: position,
      animated: false,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        //@ts-ignore
        ref={scrollViewRef}
        stickyHeaderIndices={[0]}
        style={
          {
            // paddingBottom: 50,
          }
        }
      >
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
          style={{
            zIndex: 10,
          }}
        >
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
                  align="center"
                >
                  {s.value}
                </Text>
                <Text align="center" size={fontUtils.h(10)} color={colorWhite}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <FlatList
          data={routes}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSlide(index)}
              style={[
                {
                  backgroundColor: "transparent",
                  // height: fontUtils.h(40),
                  marginTop: fontUtils.h(20),
                  flex: 1,
                  width: deivceWidth / 3,
                  alignItems: "center",
                  paddingBottom: fontUtils.h(10),
                  borderBottomWidth: index === slide ? fontUtils.w(2) : 0,
                  borderColor: colorPrimary,
                },
              ]}
            >
              <Text size={fontUtils.h(10)}>{item.title}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        {slide === 0 ? (
          <PortfolioTabScreen
            onScroll={onScrollTab}
            profileId={`${profile.id}`}
          />
        ) : slide === 1 ? (
          <ReviewTabScreen profileid={profile.id} onScroll={onScrollTab} />
        ) : (
          <ProjectTabScreen
            profileId={`${profile.id}`}
            onScroll={onScrollTab}
          />
        )}
        {/* <TabView
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
                return (
                  <PortfolioTabScreen
                    onScroll={onScrollTab}
                    profileId={`${profile.id}`}
                  />
                );
              case "reviews":
                return (
                  <ReviewTabScreen
                    profileid={profile.id}
                    onScroll={onScrollTab}
                  />
                );
              default:
                return (
                  <ProjectTabScreen
                    profileId={`${profile.id}`}
                    onScroll={onScrollTab}
                  />
                );
            }
          }}
          style={{ height: deviceHeight }}
        /> */}
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
    paddingHorizontal: fontUtils.w(7),
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
