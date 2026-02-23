import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Icon,
  Text,
  TouchableOpacity,
  ViewableAvatar,
} from "src/components/themed.components";
import { colorWhite } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { ProfileObjectType } from "src/types/app.types";
import fontUtils, { deivceWidth, deviceHeight } from "src/utils/font.utils";

const ChatHeader = ({ profile }: { profile: Partial<ProfileObjectType> }) => {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

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
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={fontUtils.h(20)}
            color={colorWhite}
          />
          <View>
            <View style={[layoutConstants.styles.rowView]}>
              <Text mr={fontUtils.h(5)} ml={fontUtils.w(10)} color={colorWhite}>
                {`${profile?.firstname} ${profile?.lastname}`}
              </Text>
              <MaterialIcons
                name="verified"
                size={fontUtils.h(12)}
                color="#F5D066"
              />
            </View>
            <Text
              ml={fontUtils.w(10)}
              size={fontUtils.h(10)}
              color={colorWhite}
              fontFamily={fontUtils.manrope_light}
              style={{
                textTransform: "capitalize",
              }}
              numberOfLines={1}
            >
              {profile?.profession || "Profession"}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[layoutConstants.styles.rowView]}>
          {/* <Icon
            type="ionicon"
            name="camera"
            onPress={() => navigation.navigate("SettingsScreen")}
            color={colorWhite}
            size={fontUtils.h(15)}
            containerStyle={styles.iconContainerStyle}
          />
          <Icon
            type="ionicon"
            name="call"
            onPress={() => navigation.navigate("SettingsScreen")}
            color={colorWhite}
            size={fontUtils.h(15)}
            containerStyle={styles.iconContainerStyle}
          /> */}
          <ViewableAvatar
            source={{
              uri: profile.avatarurl,
            }}
            size={fontUtils.h(30)}
            rounded
          />
          {/* <Icon
            type="ionicon"
            name="ellipsis-vertical"
            color={colorWhite}
            size={fontUtils.h(17)}
            onPress={() => setShowMenu(true)}
          /> */}
        </View>
      </View>
      <Modal visible={showMenu} transparent>
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuBackdropStyle}>
            <View style={styles.menuWrapperStyle}>
              {[
                {
                  label: `Report ${profile?.firstname}`,
                  icon: <Ionicons name="pencil" size={fontUtils.h(15)} />,
                },
                // {
                //   label: "Settings",
                //   icon: <Ionicons name="settings" size={fontUtils.h(15)} />,
                // },
              ].map((menu) => (
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    // menu.onPress();
                  }}
                  style={[layoutConstants.styles.rowView, styles.menuViewStyle]}
                  key={menu.label}
                >
                  {menu.icon}
                  <Text ml={fontUtils.w(12)}>{menu.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    backgroundColor: "#006089",
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
    marginHorizontal: fontUtils.w(10),
    borderWidth: fontUtils.w(1),
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: fontUtils.r(50),
    padding: fontUtils.w(10),
  },
  menuWrapperStyle: {
    position: "absolute",
    right: layoutConstants.mainViewHorizontalPadding,
    top: fontUtils.h(80),
    backgroundColor: "#FFF7E6",
    borderRadius: fontUtils.r(5),
    paddingHorizontal: fontUtils.w(15),
    paddingVertical: fontUtils.h(12),
    zIndex: 999,
    ...layoutConstants.card,
  },
  menuViewStyle: {
    marginVertical: fontUtils.h(10),
  },
  menuBackdropStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: deivceWidth,
    height: deviceHeight,
  },
});

export default ChatHeader;
