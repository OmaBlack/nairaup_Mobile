import React, { useCallback, useEffect, useMemo } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { Text, ViewableImage } from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { FlatGrid } from "react-native-super-grid";
import ListEmpty from "src/components/list.empty";
import { useGetPortfolioQuery } from "src/services/redux/apis";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { useNavigation } from "@react-navigation/native";
import { PropertyObjectType } from "src/types/properties.types";
import usePortfolio from "src/hooks/apis/usePortfolio";

export default function PortfolioTabScreen({
  profileId,
  onScroll,
}: {
  profileId: string;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const navigation = useNavigation();
  const { deletePortolio, loading } = usePortfolio();
  const { profile } = useAppSelector((state) => state.auth.user);

  const { isLoading, data, refetch } = useGetPortfolioQuery({
    //@ts-ignore
    profileid: profileId,
  });

  const onPressItem = (item: PropertyObjectType) => {
    // if (item.type === "apartment")
    //   navigation.navigate("ApartmentViewScreen", {
    //     data: item,
    //   });
    // else if (item.type === "hotel")
    //   navigation.navigate("HotelViewScreen", {
    //     data: item,
    //   });
  };

  const urls = useMemo(() => {
    const _data = data?.data || [];
    return _data?.map((r: any) => {
      return r?.url;
    });
  }, [data]);

  const doDelete = async (ids: number[]) => {
    await deletePortolio({
      ids,
    });
    refetch();
  };

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <ViewableImage
        source={{
          uri: item?.url,
        }}
        style={styles.itemImgStyle}
        withDelete={profile?.id === Number(profileId)}
        doDelete={() => doDelete([item?.id])}
        loading={loading}
        // onPress={() => onPressItem(item)}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <Text
        ml={fontUtils.w(10)}
        fontFamily={fontUtils.manrope_medium}
        mb={fontUtils.h(10)}
      >
        My Portfolio
      </Text>
      <FlatGrid
        data={data?.data || []}
        renderItem={renderItem}
        refreshControl={
          <AppRefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <ListEmpty note="You don't have any work sample on display yet" />
        }
        onScroll={onScroll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: fontUtils.w(8),
    paddingTop: fontUtils.h(30),
  },
  separatorView: {
    width: fontUtils.h(12),
    backgroundColor: "red",
  },
  itemImgStyle: {
    width: "100%",
    height: fontUtils.h(122),
    borderRadius: fontUtils.r(12),
  },
});
