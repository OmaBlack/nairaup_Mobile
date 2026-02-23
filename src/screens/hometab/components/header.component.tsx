import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Badge } from "@rneui/themed";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, TouchableOpacity } from "src/components/themed.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { useGetConnectionsSummaryQuery } from "src/services/redux/apis";
import { CapitalizeFirstLetter } from "src/utils/app.utils";
import fontUtils from "src/utils/font.utils";

const HomeTabHeader = () => {
  const navigation = useNavigation();
  const { profile } = useAppSelector((state) => state.auth.user);

  const { data: connectionSummaryData } = useGetConnectionsSummaryQuery({
    //@ts-ignore
    profileid: profile.id,
  });

  return (
    <View style={[styles.wrapperStyle]}>
      <StatusBar style="light" />
      <View
        style={[
          layoutConstants.styles.rowView,
          layoutConstants.styles.justifyContentBetween,
        ]}
      >
        <TouchableOpacity
          style={[layoutConstants.styles.rowView]}
          onPress={() => navigation.navigate("ProfileTabNavigator")}
        >
          <Avatar
            size={fontUtils.h(35)}
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
            containerStyle={styles.avatarContainerStyle}
          />
          <View>
            <Text color={colorWhite}>{`Welcome, ${profile.firstname}`}</Text>
            <Text
              size={fontUtils.h(10)}
              color={colorWhite}
              fontFamily={fontUtils.manrope_light}
            >
              <Ionicons name="location" color={"#FBBC05"} />
              {` ${CapitalizeFirstLetter(
                profile.city ?? "",
              )}, ${CapitalizeFirstLetter(profile.state ?? "")}`}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[layoutConstants.styles.rowView]}>
          <Icon
            type="ionicon"
            name="settings"
            onPress={() => navigation.navigate("SettingsScreen")}
            color={colorWhite}
            size={fontUtils.h(15)}
            containerStyle={styles.iconContainerStyle}
          />
          <View>
            <Icon
              type="material-community"
              name="chat"
              onPress={() => navigation.navigate("ChatListScreen")}
              color={colorWhite}
              size={fontUtils.h(17)}
              containerStyle={styles.iconContainerStyle}
            />
            {connectionSummaryData?.data?._sum?.totalunreadmessages &&
            connectionSummaryData?.data?._sum?.totalunreadmessages > 0 ? (
              <Badge
                value={
                  connectionSummaryData?.data?._sum?.totalunreadmessages || 0
                }
                status="success"
                containerStyle={styles.badgeContainerStyle}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    backgroundColor: colorPrimary,
    height: fontUtils.h(94),
    paddingHorizontal: fontUtils.w(20),
    justifyContent: "flex-end",
    paddingBottom: fontUtils.h(10),
  },
  avatarContainerStyle: {
    borderWidth: fontUtils.w(1),
    borderColor: colorWhite,
    marginRight: fontUtils.w(10),
  },
  iconContainerStyle: {
    marginLeft: fontUtils.w(10),
    borderWidth: fontUtils.w(1),
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: fontUtils.r(50),
    padding: fontUtils.w(10),
  },
  badgeContainerStyle: {
    position: "absolute",
    right: 0,
    top: -5,
  },
});

export default HomeTabHeader;
