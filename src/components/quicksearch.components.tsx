import React from "react";
import { Image, Text, TouchableOpacity } from "./themed.components";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import fontUtils from "src/utils/font.utils";
import { ImageSource } from "expo-image";

export const QuickSearchItem = ({
  label,
  value,
  selected,
  wrapperStyle,
  imageSource,
  onPress,
}: {
  label: string;
  value: string;
  selected?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  imageSource?: ImageSource;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.wrapperStyle,
        wrapperStyle,
        {
          backgroundColor: selected ? colorPrimary : undefined,
        },
      ]}
    >
      <Image source={imageSource} style={styles.imgStyle} />
      <Text
        ml={fontUtils.w(5)}
        color={selected ? colorWhite : undefined}
        size={fontUtils.h(12)}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: fontUtils.w(10),
    borderWidth: fontUtils.w(1),
    borderColor: colorPrimary,
    height: fontUtils.h(30),
    borderRadius: fontUtils.r(30),
    marginRight: fontUtils.w(10),
    marginBottom: fontUtils.h(10),
  },
  imgStyle: {
    height: fontUtils.h(14),
    width: fontUtils.h(14),
  },
});
