import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { Image, SafeAreaView, Text } from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import { colorPrimary } from "src/constants/colors.constants";

export default function HotelReserveSuccessScreen({
  navigation,
  route,
}: RootStackScreenProps<"HotelReserveSuccessScreen">) {
  const title = route.params.title ?? "Reservation Successful!";

  return (
    <SafeAreaView style={[styles.container]}>
      <Image
        source={require("src/assets/images/verification-success.png")}
        style={styles.bannerStyle}
        contentFit="contain"
      />
      <Text
        fontFamily={fontUtils.manrope_bold}
        mt={fontUtils.h(20)}
        mb={fontUtils.h(15)}
        size={fontUtils.h(18)}
        align="center"
        color={colorPrimary}
      >
        {title}
      </Text>
      <Text mb={fontUtils.h(30)} align="center">
        {route.params.note}
      </Text>
      <Button
        title="Back to home page"
        onPress={() => navigation.popTo("App")}
        mb={fontUtils.h(20)}
        mt={fontUtils.h(30)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  bannerStyle: {
    width: fontUtils.w(276 * 0.9),
    height: fontUtils.w(255 * 0.9),
    alignSelf: "center",
  },
});
