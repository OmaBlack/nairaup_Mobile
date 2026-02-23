import React from "react";
import { View } from "react-native";
import { Image, Text } from "./themed.components";
import { ImageSource } from "expo-image";
import { StyleSheet } from "react-native";
import fontUtils from "src/utils/font.utils";

const emptyImageSource = require("src/assets/images/empty-screen.png");

export default function ListEmpty({
  note,
  imageSource = emptyImageSource,
}: {
  note?: string;
  imageSource?: ImageSource;
}) {
  return (
    <View>
      <Image source={imageSource} style={styles.imageStyle} />
      <Text align="center" mt={fontUtils.h(20)}>
        {note}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    width: fontUtils.w(319),
    height: fontUtils.w(130),
  },
});
