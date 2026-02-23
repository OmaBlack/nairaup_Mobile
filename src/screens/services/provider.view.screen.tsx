import React, { useState } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
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
import { Avatar, Icon } from "@rneui/themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScreenHeader } from "src/components/headers.components";
import { Button } from "src/components/buttons.components";
import { TabBar, TabView } from "react-native-tab-view";
import PortfolioTabScreen from "./tabs/portfolio.tab";
import ReviewTabScreen from "./tabs/reviews.tab";
import ProjectTabScreen from "./tabs/projects.tab";
import { CapitalizeFirstLetter } from "src/utils/app.utils";
import { useConnection } from "src/hooks/apis/useChat";

const routes = [
  { key: "portfolio", title: "Portfolio" },
  { key: "reviews", title: "Reviews & Ratings" },
  { key: "projects", title: "Completed Projects" },
];

export default function ProviderViewScreen({
  navigation,
  route,
}: RootStackScreenProps<"ProviderViewScreen">) {
  const layout = useWindowDimensions();
  const { createConnection, loading } = useConnection();
  const profile = route.params.profile;
  const [index, setIndex] = useState(0);

  const doSendMessage = async (notification: any) => {
    const connection = await createConnection({
      connectionid: profile?.id,
      waitforresponse: true,
    });
    if (connection.code === 201) {
      const connectionData = connection.data[0];
      navigation.navigate("MessagingScreen", {
        connectionstring: connectionData?.connectionstring,
        profile: {
          ...connectionData?.connection,
        },
      });
    }
  };

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
              profile.avatarurl && profile.avatarurl !== ""
                ? undefined
                : `${profile.firstname.substring(
                    0,
                    1,
                  )}${profile.lastname.substring(0, 1)}`
            }
            rounded
            source={
              profile.avatarurl && profile.avatarurl !== ""
                ? {
                    uri: profile.avatarurl,
                  }
                : undefined
            }
            size={fontUtils.h(45)}
            containerStyle={styles.avatarContainerStyle}
          />
          <Text size={fontUtils.h(12)}>
            <Ionicons
              name="location"
              color={"#F5D066"}
              size={fontUtils.h(15)}
            />{" "}
            {`${CapitalizeFirstLetter(
              `${profile.city}`,
            )}, ${CapitalizeFirstLetter(`${profile.country}`)}`}
          </Text>
        </View>
        <View style={styles.contentStyle}>
          <View style={[layoutConstants.styles.rowView]}>
            <Text mr={fontUtils.h(10)} fontFamily={fontUtils.manrope_semibold}>
              {profile.firstname} {profile.lastname}
            </Text>
            <MaterialIcons
              name="verified"
              size={fontUtils.h(15)}
              color="#F5D066"
            />
          </View>
          <Text fontFamily={fontUtils.manrope_medium} mt={fontUtils.h(10)}>
            {profile.profession}
          </Text>
          <Text size={fontUtils.h(12)} mt={fontUtils.h(5)}>
            {profile.description}
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
                label: "Average Price",
                value: "N10,000",
                style: {
                  borderRightWidth: 1,
                  borderColor: colorWhite,
                },
              },
              {
                label: "Years of Experience",
                value: `${profile.yearsofexperience}+`,
                style: {
                  marginHorizontal: fontUtils.w(5),
                },
              },
              {
                label: `${profile.averagerating}/5 Ratings`,
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
      <Button
        title={`Message ${profile.firstname}`}
        onPress={doSendMessage}
        loading={loading}
        icon={
          <Icon
            type="material-community"
            name="chat"
            color={colorWhite}
            size={fontUtils.h(17)}
            containerStyle={{ marginRight: fontUtils.w(15) }}
          />
        }
        backgroundColor={"#34A853"}
        wrapperStyle={{
          marginHorizontal: layoutConstants.mainViewHorizontalPadding,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: Platform.select({
      android: fontUtils.h(30),
    }),
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
    backgroundColor: colorPrimary,
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
});
