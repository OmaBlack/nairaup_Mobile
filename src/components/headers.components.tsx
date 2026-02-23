import { JSX } from "react";
import { StyleProp, ViewStyle, View, ColorValue } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Text, TouchableOpacity } from "./themed.components";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { themeType } from "src/types/app.types";
import colorsConstants from "src/constants/colors.constants";
import { useAppTheme } from "src/providers/theme.provider";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import Constants from "expo-constants";
import layoutConstants from "src/constants/layout.constants";

export const ScreenHeader = ({
  title = "Screen",
  containerStyle,
  onBackPressed,
  titleColor,
  rightComponent,
  backBtnTitle = "Go back",
}: {
  title?: string | JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
  titleColor?: ColorValue;
  onBackPressed?: any;
  rightComponent?: JSX.Element;
  backBtnTitle?: string;
}) => {
  const { theme } = useAppTheme();
  const navigation = useNavigation();

  const backPressed = () => {
    if (onBackPressed) onBackPressed();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View
      style={[
        styles(theme).wrapperStyle,
        styles(theme).headerWrapperStyle,
        containerStyle,
      ]}
    >
      <View
        style={[
          layoutConstants.styles.rowView,
          layoutConstants.styles.justifyContentBetween,
        ]}
      >
        <TouchableOpacity
          onPress={backPressed}
          style={styles(theme).backbuttonViewStyle}
        >
          <Ionicons
            name="chevron-back"
            size={fontUtils.h(20)}
            color={titleColor ? titleColor : colorsConstants[theme].text}
          />
          <Text ml={fontUtils.w(5)} size={fontUtils.h(12)} color={titleColor}>
            {backBtnTitle}
          </Text>
        </TouchableOpacity>
        {rightComponent}
      </View>
      <View style={[styles(theme).titleViewStyle]}>
        <Text fontFamily={fontUtils.manrope_semibold}>{title}</Text>
      </View>
    </View>
  );
};

const styles = (theme: themeType) => {
  return StyleSheet.create({
    headerWrapperStyle: {},
    wrapperStyle: {
      backgroundColor: colorsConstants[theme].screenGb,
      height: Constants.statusBarHeight + fontUtils.h(30),
      justifyContent: "flex-end",
      paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
      paddingBottom: fontUtils.h(5),
    },
    titleViewStyle: {
      position: "absolute",
      alignItems: "center",
      width: deivceWidth,
      bottom: fontUtils.h(5),
    },
    backbuttonViewStyle: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
};
