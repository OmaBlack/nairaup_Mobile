import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { useGetTransactionsQuery } from "src/services/redux/apis";
import { FlatList } from "react-native-gesture-handler";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import { colorPrimary } from "src/constants/colors.constants";
import moment from "moment";
import { formatCurrency } from "src/utils/numbers.utils";
import { useNavigation } from "@react-navigation/native";

const TransactionItem = ({ item }: { item: any }) => {
  const navigation = useNavigation();
  const isHotel = item?.reservation;

  const onPress = () => {
    if (isHotel)
      navigation.navigate("HotelViewScreen", {
        data: { ...item?.reservation?.room?.property },
      });
    else
      navigation.navigate("ApartmentViewScreen", {
        data: { ...item?.property },
      });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        layoutConstants.styles.rowView,
        layoutConstants.styles.justifyContentBetween,
        styles.listItemViewStyle,
      ]}
    >
      <View style={styles.listLeftViewStyle}>
        <Text>{item?.property?.title || item?.reservation?.room?.title}</Text>
        <Text>{formatCurrency(Number(item?.amount || 0))}</Text>
      </View>
      <View>
        <Text align="right" color={colorPrimary}>
          Successful
        </Text>
        <Text size={fontUtils.h(10)} color={"#929292"}>
          {moment(item?.createdat).format("MMM Do YYYY | h:mma")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function TransactionsScreen({
  navigation,
  route,
}: RootStackScreenProps<"TransactionsScreen">) {
  const { theme } = useAppTheme();
  const { profile } = useAppSelector((state) => state.auth.user);

  const { isFetching, isLoading, data, refetch } = useGetTransactionsQuery({
    profileid: profile.id,
    limit: 1000,
  });

  const renderItem = useCallback(
    ({ item, index }: any) => <TransactionItem item={item} />,
    [],
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        refreshControl={
          <AppRefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemViewStyle: {
    paddingHorizontal: fontUtils.w(15),
    paddingVertical: fontUtils.h(10),
    marginBottom: fontUtils.h(12),
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: fontUtils.r(10),
  },
  listLeftViewStyle: { flex: 1, marginRight: fontUtils.w(20) },
});
