import React from "react";
import {
  ColorValue,
  DimensionValue,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import colorsConstants, { colorNeutrals } from "src/constants/colors.constants";
import { useAppTheme } from "src/providers/theme.provider";
import fontUtil from "src/utils/font.utils";

export const Line = ({
  height = fontUtil.h(1),
  flex,
  width,
  containerStyle = {},
  backgroundColor,
}: {
  height?: DimensionValue;
  flex?: number;
  width?: DimensionValue;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: ColorValue;
}) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        {
          flex: flex ? flex : undefined,
          backgroundColor: backgroundColor
            ? backgroundColor
            : colorNeutrals[theme].N10,
          height: height,
          width: width ? width : undefined,
        },
        containerStyle,
      ]}
    ></View>
  );
};
