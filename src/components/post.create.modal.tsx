import React, { useEffect, useRef } from "react";
import { DeviceEventEmitter, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { APP_SHOW_ADD_POST_MODAL } from "src/constants/app.constants";
import { Icon, Image, Text, TouchableOpacity } from "./themed.components";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const itemWidth = (deivceWidth - fontUtils.w(60)) / 3;
export default function CreatePostModal({}: {}) {
  const modalRef = useRef<Modalize>(null);
  const navigation = useNavigation();

  const showModal = (e: any) => {
    modalRef.current?.open();
  };

  useEffect(() => {
    DeviceEventEmitter.addListener(APP_SHOW_ADD_POST_MODAL, showModal);
    return () => {
      DeviceEventEmitter.removeAllListeners(APP_SHOW_ADD_POST_MODAL);
    };
  }, []);

  return (
    <Modalize
      withReactModal
      withHandle={false}
      adjustToContentHeight
      ref={modalRef}
      modalStyle={styles.modalStyle}
    >
      <Icon
        name="close-circle"
        type="ionicon"
        onPress={() => modalRef.current?.close()}
        containerStyle={{
          alignSelf: "flex-end",
        }}
      />
      <Text
        size={fontUtils.h(12)}
        fontFamily={fontUtils.manrope_bold}
        mb={fontUtils.h(25)}
      >
        Make a listing
      </Text>
      <View style={styles.contentStyle}>
        {[
          {
            label: "Apartment listing",
            image: require("src/assets/images/icons/fluent-emoji_house.png"),
            onPress: () =>
              navigation.navigate("ApartmentCreateScreen", {
                type: "apartment",
              }),
          },
          {
            label: "Hotel listing",
            image: require("src/assets/images/icons/fxemoji_hotel.png"),
            onPress: () =>
              navigation.navigate("ApartmentCreateScreen", {
                type: "hotel",
              }),
          },
          {
            label: "Job listing",
            image: require("src/assets/images/icons/streamline-ultimate-color_job-seach-woman.png"),
            onPress: () =>
              navigation.navigate("ApartmentCreateScreen", {
                type: "job",
              }),
          },
        ].map((m) => (
          <TouchableOpacity
            key={m.label}
            style={styles.itemStyle}
            onPress={() => {
              modalRef.current?.close();
              m.onPress();
            }}
          >
            <Image
              source={m.image}
              style={styles.iconStyle}
              onPress={() => {
                modalRef.current?.close();
                m.onPress();
              }}
            />
            <Text size={fontUtils.h(10)} fontFamily={fontUtils.manrope_medium}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modalize>
  );
}

export const showCreatePostModal = () => {
  DeviceEventEmitter.emit(APP_SHOW_ADD_POST_MODAL);
};

const styles = StyleSheet.create({
  modalStyle: {
    paddingHorizontal: fontUtils.w(15),
    paddingTop: fontUtils.h(10),
  },
  contentStyle: {
    paddingBottom: fontUtils.h(50),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemStyle: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: fontUtils.r(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF5FE",
  },
  iconStyle: {
    width: fontUtils.w(24),
    height: fontUtils.w(24),
    marginBottom: fontUtils.h(12),
  },
});
