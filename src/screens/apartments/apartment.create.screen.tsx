import React from "react";
import { StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { Image, SafeAreaView, Text } from "src/components/themed.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import layoutConstants from "src/constants/layout.constants";

export default function ApartmentCreateScreen({
  navigation,
  route,
}: RootStackScreenProps<"ApartmentCreateScreen">) {
  const type = route.params.type;

  const doNext = () => {
    if (type === "job") navigation.replace("JobCreateNextScreen");
    else
      navigation.replace("ApartmentCreateNextScreen", {
        ...route.params,
      });
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {type === "apartment" || type === "job" ? (
        <Text
          align="center"
          size={fontUtils.h(25)}
          fontFamily={fontUtils.manrope_semibold}
        >
          {type === "job"
            ? `Get access to a wide\nrange of `
            : `List your property and\nattract `}
          <Text
            color={colorPrimary}
            size={fontUtils.h(25)}
            fontFamily={fontUtils.manrope_semibold}
          >
            {type === "job" ? "Vacancies" : `interested\nbuyers`}
          </Text>
        </Text>
      ) : (
        <Text
          align="center"
          size={fontUtils.h(25)}
          fontFamily={fontUtils.manrope_semibold}
        >
          {`Find `}
          <Text
            color={colorPrimary}
            size={fontUtils.h(25)}
            fontFamily={fontUtils.manrope_semibold}
          >
            {`Hotels`}
          </Text>
          {` and\n`}
          <Text
            color={colorPrimary}
            size={fontUtils.h(25)}
            fontFamily={fontUtils.manrope_semibold}
          >
            {`Shortlets`}
          </Text>
          {` around you`}
        </Text>
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.slideAViewStyle}>
          <Image
            source={require("src/assets/images/sliders/splash-1a.jpg")}
            style={styles.slideAStyle}
          />
        </View>
        <View style={styles.slideBViewStyle}>
          <Image
            source={require("src/assets/images/sliders/splash-1b.jpg")}
            style={styles.slideBStyle}
          />
        </View>
      </View>
      <Button
        title={"Create Listing"}
        onPress={doNext}
        wrapperStyle={{
          marginHorizontal: layoutConstants.mainViewHorizontalPadding,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: fontUtils.h(20),
  },
  slideAStyle: {
    height: fontUtils.h(293),
    width: fontUtils.w(252),
    borderTopRightRadius: fontUtils.r(16),
    borderBottomRightRadius: fontUtils.r(16),
  },
  slideAViewStyle: {
    alignSelf: "flex-start",
    marginTop: fontUtils.h(20),
    borderWidth: fontUtils.w(3),
    borderLeftWidth: 0,
    borderBottomWidth: fontUtils.w(3),
    borderColor: colorWhite,
    borderTopRightRadius: fontUtils.r(16),
    borderBottomRightRadius: fontUtils.r(16),
  },
  slideBStyle: {
    height: fontUtils.h(293),
    width: fontUtils.w(252),
    borderTopLeftRadius: fontUtils.r(16),
    borderBottomLeftRadius: fontUtils.r(16),
  },
  slideBViewStyle: {
    position: "absolute",
    top: fontUtils.h(180),
    alignSelf: "flex-end",
    borderWidth: fontUtils.w(3),
    borderRightWidth: 0,
    borderColor: colorWhite,
    borderTopLeftRadius: fontUtils.r(16),
    borderBottomLeftRadius: fontUtils.r(16),
  },
});
