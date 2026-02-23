import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "src/components/buttons.components";
import {
  Image,
  Text,
  TouchableOpacity,
} from "src/components/themed.components";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";

export const ProviderSearchItem = memo(function ProviderSearchItem({}: {}) {
  const navigation = useNavigation();

  const doView = () =>
    navigation.navigate("ProviderViewScreen", {
      id: 1,
    });

  return (
    <TouchableOpacity style={[styles.wrapperStyle]} onPress={doView}>
      <View>
        <Image
          source={require("src/assets/images/sliders/splash-3b.jpg")}
          style={styles.imgStyle}
        />
        <View style={styles.tagViewStyle}>
          <Text size={fontUtils.h(8)}>Available</Text>
        </View>
      </View>
      <View style={styles.contentStyle}>
        <View style={styles.topViewStyle}>
          <View
            style={[
              layoutConstants.styles.rowView,
              layoutConstants.styles.justifyContentBetween,
            ]}
          >
            <View style={[layoutConstants.styles.rowView]}>
              <Text mr={fontUtils.h(5)} fontFamily={fontUtils.manrope_semibold}>
                Ross Geller
              </Text>
              <MaterialIcons
                name="verified"
                size={fontUtils.h(15)}
                color="#F5D066"
              />
            </View>
            <Image
              source={require("src/assets/images/icons/stash_save-ribbon.png")}
              style={styles.ribbonStyle}
            />
          </View>
          <Text mt={fontUtils.h(2)} size={fontUtils.h(12)} mb={fontUtils.h(5)}>
            Profession
          </Text>
          <View style={[layoutConstants.styles.rowView]}>
            <AntDesign name="star" size={fontUtils.h(8)} color={"#F5D066"} />
            <Text size={fontUtils.h(10)} ml={fontUtils.w(2)}>
              5.0
            </Text>
          </View>
        </View>
        <View style={styles.bottomViewStyle}>
          <Text size={fontUtils.h(10)}>Yaba, Lagos</Text>
          <Button
            title={"Send Message"}
            onPress={doView}
            buttonHeight={fontUtils.h(28)}
            titleStyle={styles.btnTitleStyle}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  wrapperStyle: {
    marginBottom: fontUtils.h(10),
    flexDirection: "row",
    paddingVertical: fontUtils.h(4),
    paddingLeft: fontUtils.w(2),
    paddingRight: fontUtils.w(5),
  },
  contentStyle: {
    flex: 1,
    marginLeft: fontUtils.w(10),
  },
  imgStyle: {
    height: fontUtils.w(102),
    width: fontUtils.w(124),
    borderRadius: fontUtils.r(10),
  },
  bottomViewStyle: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  topViewStyle: {
    flex: 1,
  },
  btnTitleStyle: {
    fontSize: fontUtils.h(9),
  },
  ribbonStyle: {
    width: fontUtils.w(25),
    height: fontUtils.w(25),
  },
  tagViewStyle: {
    backgroundColor: "#A8FEBF",
    position: "absolute",
    paddingHorizontal: fontUtils.w(4),
    borderRadius: fontUtils.r(6),
  },
});
