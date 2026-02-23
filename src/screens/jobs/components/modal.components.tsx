import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Text } from "src/components/themed.components";
import { colorSuccess, colorWhite } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";

export const ResponseModal = ({
  modalRef,
  onClosed,
  message = "Application submitted to NairaUp",
}: {
  modalRef?: any;
  onClosed?: any;
  message?: string;
}) => {
  const closeModal = () => {
    modalRef?.current?.close();
  };

  return (
    <Modalize
      ref={modalRef}
      withHandle={false}
      withReactModal
      modalStyle={{
        minHeight: `100%`,
        backgroundColor: `transparent`,
      }}
      onClosed={onClosed}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View
          style={{
            backgroundColor: `transparent`,
            minHeight: `100%`,
            justifyContent: `center`,
            paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
          }}
        >
          <View style={styles.modalContentStyle}>
            <View style={[layoutConstants.styles.rowView]}>
              <Ionicons
                name="checkmark-circle"
                size={fontUtils.h(25)}
                color={colorSuccess}
                style={styles.notificationIconStyle}
              />
              <View style={{ flex: 1, marginRight: fontUtils.w(15) }}>
                <Text ml={fontUtils.w(10)}>{message}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  modalContentStyle: {
    borderRadius: fontUtils.w(12),
    paddingHorizontal: fontUtils.w(15),
    paddingVertical: fontUtils.h(15),
    backgroundColor: colorWhite,
  },
  notificationIconStyle: {},
});
