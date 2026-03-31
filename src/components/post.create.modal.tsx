import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { APP_SHOW_ADD_POST_MODAL } from "src/constants/app.constants";
import { Icon, Text } from "./themed.components";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import { useNavigation } from "@react-navigation/native";
import { Image as ExpoImage } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const itemWidth = (deivceWidth - fontUtils.w(60)) / 3;

const ITEMS = [
  {
    label: "Apartment listing",
    image: require("src/assets/images/icons/fluent-emoji_house.png"),
    type: "apartment",
  },
  {
    label: "Hotel listing",
    image: require("src/assets/images/icons/fxemoji_hotel.png"),
    type: "hotel",
  },
  {
    label: "Job listing",
    image: require("src/assets/images/icons/streamline-ultimate-color_job-seach-woman.png"),
    type: "job",
  },
] as const;

export default function CreatePostModal() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      APP_SHOW_ADD_POST_MODAL,
      () => setVisible(true),
    );
    return () => listener.remove();
  }, []);

  const handleItemPress = (type: "apartment" | "hotel" | "job") => {
    setVisible(false);
    setTimeout(() => {
      navigation.navigate("ApartmentCreateScreen", { type });
    }, 250);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => setVisible(false)}
    >
      <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
      <View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + fontUtils.h(20) },
        ]}
      >
        <Icon
          name="close-circle"
          type="ionicon"
          onPress={() => setVisible(false)}
          containerStyle={{ alignSelf: "flex-end" }}
        />
        <Text
          size={fontUtils.h(12)}
          fontFamily={fontUtils.manrope_bold}
          mb={fontUtils.h(25)}
        >
          Make a listing
        </Text>
        <View style={styles.contentStyle}>
          {ITEMS.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.itemStyle,
                pressed && styles.itemPressed,
              ]}
              onPress={() => handleItemPress(item.type)}
            >
              <ExpoImage source={item.image} style={styles.iconStyle} />
              <Text
                size={fontUtils.h(10)}
                fontFamily={fontUtils.manrope_medium}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

export const showCreatePostModal = () => {
  DeviceEventEmitter.emit(APP_SHOW_ADD_POST_MODAL);
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingHorizontal: fontUtils.w(15),
    paddingTop: fontUtils.h(10),
    borderTopLeftRadius: fontUtils.r(16),
    borderTopRightRadius: fontUtils.r(16),
  },
  contentStyle: {
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
  itemPressed: {
    opacity: 0.7,
  },
  iconStyle: {
    width: fontUtils.w(24),
    height: fontUtils.w(24),
    marginBottom: fontUtils.h(12),
  },
});
