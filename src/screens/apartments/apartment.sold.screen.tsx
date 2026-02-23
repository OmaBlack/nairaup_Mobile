import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  View,
  Text,
  Image,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { colorPrimary } from "src/constants/colors.constants";
import { Button } from "src/components/buttons.components";
import { SoldApartmentItem } from "src/components/apartments.components";
import { useGetPropertyQuery } from "src/services/redux/apis/unauth.api.requests";

export default function ApartmentSoldScreen({
  navigation,
  route,
}: RootStackScreenProps<"ApartmentSoldScreen">) {
  const data = route.params.data;
  const { data: propertyData, isFetching } = useGetPropertyQuery(data.id);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.mainContentStyle}>
        <Text
          color={colorPrimary}
          size={fontUtils.h(22)}
          align="center"
          mt={fontUtils.h(50)}
          fontFamily={fontUtils.manrope_bold}
        >
          Congratulations!
        </Text>
        <Text align="center" size={fontUtils.h(12)} mt={fontUtils.h(4)}>
          On the sale of your property
        </Text>
        <Image
          source={require("src/assets/images/celebrating-success.png")}
          style={styles.imageStyle}
        />
        <SoldApartmentItem property={propertyData?.data} />
      </View>
      <Button
        title={"Rate Buyer"}
        onPress={() =>
          navigation.navigate("ApartmentRateBuyerScreen", {
            id: propertyData?.data?.transactions[0]?.profile?.id,
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: fontUtils.h(40),
  },
  mainContentStyle: {
    flex: 1,
  },
  imageStyle: {
    height: fontUtils.w(321),
    width: fontUtils.w(315),
    alignSelf: "center",
    marginTop: fontUtils.h(20),
    marginBottom: fontUtils.h(20),
  },
});
