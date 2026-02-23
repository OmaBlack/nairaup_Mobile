import React from "react";
import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";
import fontUtil from "src/utils/font.utils";

export const Line = ({
  height = fontUtil.h(1),
  flex,
  width,
  containerStyle = {},
}: {
  height?: DimensionValue;
  flex?: number;
  width?: DimensionValue;
  containerStyle?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      style={[
        {
          flex: flex ? flex : undefined,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          height: height,
          width: width ? width : undefined,
        },
        containerStyle,
      ]}
    ></View>
  );
};
