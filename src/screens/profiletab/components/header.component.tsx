import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "@rneui/themed";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScreenHeader } from "src/components/headers.components";
import ItemSavedIcon from "src/components/svgs/item.saved";
import { Icon, Text, TouchableOpacity } from "src/components/themed.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import fontUtils, { deivceWidth, deviceHeight } from "src/utils/font.utils";

export const RightComponentMenu = () => {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <View>
      <Icon
        name="ellipsis-vertical"
        type="ionicon"
        color={colorWhite}
        onPress={() => setShowMenu(true)}
      />
      <Modal visible={showMenu} transparent>
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuBackdropStyle}>
            <View style={styles.menuWrapperStyle}>
              {[
                {
                  label: "Edit Profile",
                  icon: (
                    <Ionicons
                      name="pencil"
                      color={colorPrimary}
                      size={fontUtils.h(15)}
                    />
                  ),
                  onPress: () => navigation.navigate("ProfileEditScreen"),
                },
                // {
                //   label: "Listings",
                //   icon: (
                //     <FontAwesome6
                //       name="file-invoice"
                //       color={colorPrimary}
                //       size={fontUtils.h(15)}
                //     />
                //   ),
                //   onPress: () => navigation.navigate("ProfileEditScreen"),
                // },
                {
                  label: "Reviews and Ratings",
                  icon: (
                    <MaterialCommunityIcons
                      name="message-star"
                      color={colorPrimary}
                      size={fontUtils.h(17)}
                    />
                  ),
                  onPress: () => navigation.navigate("ReviewsScreen"),
                },
                {
                  label: "Saved Items",
                  icon: <ItemSavedIcon color={colorPrimary} />,
                  onPress: () => navigation.navigate("SavedItemsScreen"),
                },
                // {
                //   label: "Work Samples",
                //   icon: (
                //     <MaterialIcons
                //       name="featured-play-list"
                //       color={colorPrimary}
                //       size={fontUtils.h(15)}
                //     />
                //   ),
                //   onPress: () => navigation.navigate("ProfileEditScreen"),
                // },
                {
                  label: "Transactions",
                  icon: (
                    <Ionicons
                      name="cash"
                      color={colorPrimary}
                      size={fontUtils.h(15)}
                    />
                  ),
                  onPress: () => navigation.navigate("TransactionsScreen"),
                },
                {
                  label: "Settings",
                  icon: (
                    <Ionicons
                      name="settings"
                      color={colorPrimary}
                      size={fontUtils.h(15)}
                    />
                  ),
                  onPress: () => navigation.navigate("SettingsScreen"),
                },
              ].map((menu) => (
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    menu.onPress();
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

const ProfileTabHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={[styles.wrapperStyle]}>
      <ScreenHeader
        title={""}
        titleColor={colorWhite}
        containerStyle={styles.containerStyle}
      />
      <View
        style={[
          layoutConstants.styles.rowView,
          layoutConstants.styles.justifyContentBetween,
          styles.headerViewStyle,
        ]}
      >
        <Avatar
          title="AS"
          rounded
          size={fontUtils.h(50)}
          containerStyle={styles.avatarContainerStyle}
          avatarStyle={{ backgroundColor: colorPrimary }}
        />
        <View style={styles.priceViewStyle}>
          <Text fontFamily={fontUtils.manrope_bold}>N10,000</Text>
          <Text size={fontUtils.h(8)}>Average price</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    backgroundColor: "white",
    // backgroundColor: colorPrimary,
    // height: fontUtils.h(94),
    // paddingHorizontal: fontUtils.w(20),
    // justifyContent: "flex-end",
    // paddingBottom: fontUtils.h(10),
  },
  containerStyle: {
    backgroundColor: colorPrimary,
    height: fontUtils.h(110),
    paddingBottom: fontUtils.h(30),
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
  priceViewStyle: {
    alignItems: "center",
    marginBottom: fontUtils.h(-20),
    borderWidth: 1,
    borderColor: colorPrimary,
    borderRadius: fontUtils.r(20),
    paddingHorizontal: fontUtils.w(15),
    paddingVertical: fontUtils.h(5),
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

export default ProfileTabHeader;
