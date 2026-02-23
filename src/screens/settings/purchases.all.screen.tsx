import React from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import { FlatList } from "react-native-gesture-handler";
import fontUtils from "src/utils/font.utils";
import { PurchasedApartmentItem } from "src/components/apartments.components";

export default function AllPurchasesScreen({
  navigation,
  route,
}: RootStackScreenProps<"AllPurchasesScreen">) {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container]}>
      <FlatList
        data={[{}, {}, {}]}
        renderItem={({ item, index }) => <PurchasedApartmentItem />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: fontUtils.h(20),
  },
});
