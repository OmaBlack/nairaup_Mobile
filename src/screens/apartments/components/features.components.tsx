import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Text } from "src/components/themed.components";
import colorsConstants from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { PropertyFeatureType } from "src/types/properties.types";
import fontUtils from "src/utils/font.utils";

export const ApartmentFeatures = ({
  features,
}: {
  features: PropertyFeatureType[];
}) => {
  const materialIcons = ["road-variant"];
  const fontAwesome6Icons = ["person-swimming"];
  return (
    <View style={styles.detailsTagViewStyle}>
      {features.map((detail) => (
        <View
          key={detail.feature}
          style={[
            layoutConstants.styles.rowView,
            {
              backgroundColor: colorsConstants.convertToRgba(
                //@ts-ignore
                detail.color,
                0.05,
              ),
            },
            styles.detailViewStyle,
          ]}
        >
          {materialIcons.includes(detail.slug) ? (
            <MaterialCommunityIcons
              //@ts-ignore
              name={detail.slug}
              color={detail.color}
              size={fontUtils.h(16)}
            />
          ) : fontAwesome6Icons.includes(detail.slug) ? (
            <FontAwesome6
              //@ts-ignore
              name={detail.slug}
              color={detail.color}
              size={fontUtils.h(16)}
            />
          ) : (
            <Ionicons
              //@ts-ignore
              name={detail.slug}
              color={detail.color}
              size={fontUtils.h(16)}
            />
          )}
          <View style={styles.addressViewStyle}>
            <Text
              ml={fontUtils.w(5)}
              mr={fontUtils.w(10)}
              size={fontUtils.h(11)}
            >
              {detail.feature}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  detailsTagViewStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: fontUtils.h(20),
    marginBottom: fontUtils.h(15),
  },
  detailViewStyle: {
    borderRadius: fontUtils.r(10),
    paddingLeft: fontUtils.w(12),
    paddingRight: fontUtils.w(2),
    paddingVertical: fontUtils.h(10),
    marginRight: fontUtils.w(10),
    marginBottom: fontUtils.h(10),
  },
  addressViewStyle: {},
});
