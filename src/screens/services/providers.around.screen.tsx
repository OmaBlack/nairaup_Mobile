import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { SafeAreaView, Text } from "src/components/themed.components";
import { Input } from "src/components/inputs.components";
import { Feather } from "@expo/vector-icons";
import fontUtils from "src/utils/font.utils";
import { FlatList } from "react-native-gesture-handler";
import { ProviderSearchItem } from "./components/provider.components";

export default function ProviderAroundScreen({
  navigation,
  route,
}: RootStackScreenProps<"ProviderAroundScreen">) {
  const renderItem = useCallback(
    ({ item, index }: any) => <ProviderSearchItem />,
    [],
  );
  return (
    <SafeAreaView style={styles.container}>
      <Input
        placeholder="Search"
        leftIcon={
          <Feather
            name="search"
            style={{ marginLeft: fontUtils.w(15) }}
            size={fontUtils.h(20)}
            color={"rgba(0, 0, 0, 0.5)"}
          />
        }
        inputHeight={fontUtils.h(40)}
      />
      <Text mb={fontUtils.h(15)} size={fontUtils.h(12)}>
        5 search results
      </Text>
      <FlatList data={[{}, {}, {}]} renderItem={renderItem} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
});
