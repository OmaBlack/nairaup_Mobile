import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { JSX, useMemo } from "react";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "src/components/buttons.components";
import { Text, ViewableImage } from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import { useGetPropertyFeaturesQuery } from "src/services/redux/apis/unauth.api.requests";
import { AddPropertyRoomDto } from "src/types/properties.types";
import fontUtils from "src/utils/font.utils";
import { shortenNumber } from "src/utils/numbers.utils";

const Features = ({ label, icon }: { label: string; icon: JSX.Element }) => {
  return (
    <View style={styles.featureWrapperStyle}>
      {icon}
      <Text size={fontUtils.h(7)} ml={fontUtils.w(1)}>
        {label}
      </Text>
    </View>
  );
};

export const RoomItem = memo(function RoomItem(
  data: AddPropertyRoomDto & {
    id: number;
  },
) {
  const navigation = useNavigation();
  const { data: featureData } = useGetPropertyFeaturesQuery(null);

  const features = useMemo(() => {
    return data.featureids.map((e) => {
      const key = `${e}`;
      return {
        //@ts-ignore
        label: featureData?.indexedData[key]?.feature,
        icon: "",
      };
    });
  }, [data.featureids, featureData]);

  return (
    <View style={[styles.wrapperStyle]}>
      <ViewableImage
        source={{
          uri: data.featuredimageurl,
        }}
        style={styles.imgStyle}
      />
      <View style={styles.mainContentstyle}>
        <Text
          numberOfLines={2}
          mt={fontUtils.h(5)}
          mb={fontUtils.h(5)}
          size={fontUtils.h(12)}
          fontFamily={fontUtils.manrope_medium}
        >
          {data.title}
        </Text>
        {/* <View style={[layoutConstants.styles.rowView]}>
          <AntDesign name="arrow-up" size={fontUtils.h(10)} color="black" />
          <Text size={fontUtils.h(9)}>Topmost floor</Text>
        </View> */}
        <Text size={fontUtils.h(10)} mt={fontUtils.h(7)} numberOfLines={2}>
          {data.description}
        </Text>
        <View style={styles.featuresViewStyle}>
          {features.map((f) => (
            //@ts-ignore
            <Features key={f.label} label={f.label} icon={f.icon} />
          ))}
        </View>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
            styles.pricingViewStyle,
          ]}
        >
          <Text size={fontUtils.h(7)}>Price per night:</Text>
          <View style={styles.pricesViewStyle}>
            <View style={[layoutConstants.styles.rowView]}>
              <Text size={fontUtils.h(6)} style={styles.discountTextStyle}>
                N200,000
              </Text>
              <Text
                ml={fontUtils.w(1)}
                size={fontUtils.h(10)}
                fontFamily={fontUtils.manrope_bold}
              >
                {`N${shortenNumber(data.price)}`}
              </Text>
            </View>
          </View>
        </View>
        <Text align="right" size={fontUtils.h(6)}>
          Includes taxex and charges
        </Text>
      </View>
      <Button
        title={"Make Reservation"}
        onPress={() =>
          navigation.navigate("HotelReserveScreen", {
            id: data.id,
            room: data,
          })
        }
        buttonHeight={fontUtils.h(30)}
        wrapperStyle={styles.btnWrapperStyle}
        titleStyle={styles.btnTitleStyle}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrapperStyle: {
    width: fontUtils.w(162),
    height: fontUtils.h(251),
    borderWidth: fontUtils.w(1),
    borderColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: fontUtils.r(5),
    overflow: "hidden",
    marginRight: fontUtils.w(10),
  },
  imgStyle: {
    width: fontUtils.w(162),
    height: fontUtils.h(72),
  },
  mainContentstyle: {
    flex: 1,
    marginBottom: fontUtils.h(10),
    marginHorizontal: fontUtils.w(5),
  },
  btnWrapperStyle: {
    marginHorizontal: fontUtils.w(5),
    marginBottom: fontUtils.h(5),
  },
  btnTitleStyle: {
    fontSize: fontUtils.h(11),
    fontFamily: fontUtils.manrope_regular,
  },
  pricingViewStyle: {
    marginTop: fontUtils.h(10),
  },
  discountTextStyle: {
    textDecorationLine: "line-through",
  },
  pricesViewStyle: {
    justifyContent: "flex-end",
  },
  featureWrapperStyle: {
    borderWidth: fontUtils.w(1),
    borderColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: fontUtils.r(3),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: fontUtils.w(3),
    marginRight: fontUtils.w(5),
    marginBottom: fontUtils.h(5),
  },
  featuresViewStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: fontUtils.h(5),
  },
});
