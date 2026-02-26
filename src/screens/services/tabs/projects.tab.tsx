import React, { useCallback } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { PropertyObjectType } from "src/types/properties.types";
import { AppRefreshControl } from "src/components/refreshcontrol.component";
import { useGetPropertiesQuery } from "src/services/redux/apis/unauth.api.requests";

export default function ProjectTabScreen({
  profileId,
  onScroll,
}: {
  profileId: string;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const navigation = useNavigation();
  const { profile } = useAppSelector((state) => state.auth.user);

  const { isLoading, data, refetch } = useGetPropertiesQuery({
    //@ts-ignore
    profileid: profileId,
    status: "sold",
  });

  const onPressItem = (item: PropertyObjectType) => {
    if (item.type === "apartment")
      navigation.navigate("ApartmentViewScreen", {
        data: item,
      });
    else if (item.type === "hotel")
      navigation.navigate("HotelViewScreen", {
        data: item,
      });
  };

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <ViewableImage
        source={{
          uri: item?.featuredimageurl,
        }}
        style={styles.itemImgStyle}
        onPress={() => onPressItem(item)}
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
        Completed Projects
      </Text>
      <FlatGrid
        data={data?.data || []}
        renderItem={renderItem}
        refreshControl={
          <AppRefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <ListEmpty note="You don't have any completed or ongoing project yet. All projects will appear here" />
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
