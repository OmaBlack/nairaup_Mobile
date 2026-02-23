import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView } from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import ServicesTabScreen from "../hometab/tabs/services.tab";

export default function ServicesExploreScreen({
  navigation,
  route,
}: RootStackScreenProps<"ExploreTabNavigator">) {
  const [quickSearch, setQuickSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ServicesTabScreen
        navigation={navigation}
        route={route}
        withSearch={false}
      />
      {/* <View style={styles.headerViewStyle}>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          <Text fontFamily={fontUtils.manrope_semibold} size={fontUtils.h(15)}>
            Explore
          </Text>
          <SelectInput
            items={[]}
            value={""}
            placeholder="Servces"
            wrapperStyle={{
              width: fontUtils.w(160),
            }}
          />
        </View>
        <View style={styles.filtersViewStyle}>
          <SelectInput
            items={[]}
            value={""}
            placeholder="Servces type"
            wrapperStyle={{
              marginBottom: fontUtils.h(10),
            }}
          />
          <View style={[layoutConstants.styles.rowView]}>
            <SelectInput
              items={[]}
              value={""}
              placeholder="Location"
              wrapperStyle={{ flex: 1, marginRight: fontUtils.w(5) }}
            />
            <SelectInput
              items={[]}
              value={""}
              placeholder="Price range"
              wrapperStyle={{ flex: 1, marginLeft: fontUtils.w(5) }}
            />
          </View>
        </View>
      </View>
      <Button
        title={"Search"}
        icon={
          <Feather name="search" size={fontUtils.h(18)} color={colorWhite} />
        }
        buttonHeight={fontUtils.h(40)}
        titleStyle={{
          fontFamily: fontUtils.manrope_regular,
          fontSize: fontUtils.h(12),
        }}
        wrapperStyle={{
          alignSelf: "center",
          width: fontUtils.w(130),
          marginBottom: fontUtils.h(20),
        }}
      /> */}
      {/* <View style={styles.quickSearchViewStyle}>
        <Text fontFamily={fontUtils.manrope_semibold}>Quick search</Text>
        <View
          style={[
            layoutConstants.styles.rowView,
            styles.quickSearchItemsViewStyle,
          ]}
        >
          {[
            {
              label: "Cleaning",
              value: "Cleaners",
              imageSource: require("src/assets/images/icons/fluent-emoji_house.png"),
            },
            {
              label: "Plumbing",
              value: "Plumbers",
              imageSource: require("src/assets/images/icons/fluent-emoji_house.png"),
            },
          ].map((item) => (
            <QuickSearchItem
              key={item.value}
              {...item}
              selected={quickSearch === item.label}
              onPress={() => {
                setQuickSearch(item.label);
                navigation.navigate("ProviderAroundScreen", {
                  providerType: item.value,
                });
              }}
            />
          ))}
        </View>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  headerViewStyle: {
    marginTop: fontUtils.h(40),
    marginBottom: fontUtils.h(20),
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  filtersViewStyle: {
    marginTop: fontUtils.h(20),
  },
  quickSearchViewStyle: {
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
    marginTop: fontUtils.h(20),
  },
  quickSearchItemsViewStyle: {
    flexWrap: "wrap",
  },
});
