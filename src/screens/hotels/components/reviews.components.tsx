import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Line } from "src/components/line.components";
import { Text } from "src/components/themed.components";
import { colorPrimary } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";

export const ReviewItem = memo(function ReviewItem({
  note,
  firstname,
  city,
}: {
  note: string;
  firstname: string;
  city: string;
}) {
  return (
    <View style={[styles.wrapperStyle]}>
      <Text size={fontUtils.h(10)} mb={fontUtils.h(10)}>
        {note}
      </Text>
      <View style={[layoutConstants.styles.rowView]}>
        <Line containerStyle={styles.lineContainerStyle} />
        <View style={[layoutConstants.styles.rowView]}>
          <Text mr={fontUtils.w(4)} size={fontUtils.h(11)}>
            {firstname}
          </Text>
          <Ionicons name="ellipse" size={fontUtils.h(4)} />
          <Text ml={fontUtils.w(4)} size={fontUtils.h(11)}>
            {city}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapperStyle: {
    backgroundColor: "#F8FBFF",
    marginRight: fontUtils.w(10),
    borderRadius: fontUtils.r(10),
    paddingHorizontal: fontUtils.w(10),
    paddingVertical: fontUtils.h(12),
    width: fontUtils.w(230),
  },
  lineContainerStyle: {
    flex: 1,
    backgroundColor: colorPrimary,
    marginRight: fontUtils.w(10),
  },
});
