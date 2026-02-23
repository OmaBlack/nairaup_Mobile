import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Button } from "src/components/buttons.components";
import { Icon, Text } from "src/components/themed.components";
import {
  colorDanger,
  colorPrimary,
  colorSuccess,
  colorWhite,
} from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import useProperties from "src/hooks/apis/useProperties";
import { useAppDispatch } from "src/hooks/useReduxHooks";
import { reduxApiRequests } from "src/services/redux/apis";
import { PropertyObjectType } from "src/types/properties.types";
import fontUtils from "src/utils/font.utils";

export const ResponseModal = ({
  title = "Awaiting Approval",
  note = "Your apartment listing has been submitted successfully. Kindly check your notifications for update. Thank you!",
  modalRef,
  onClose = () => null,
  btnTitle = "Done",
  onCancel = () => null,
  btnCancel = "Cancel",
}: {
  title?: string;
  note?: string;
  modalRef?: any;
  onClose?: any;
  btnTitle?: string;
  btnCancel?: string;
  onCancel?: any;
}) => {
  const doDone = () => {
    modalRef?.current?.close();
    onClose();
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
    >
      <View
        style={{
          backgroundColor: `transparent`,
          minHeight: `100%`,
          justifyContent: `center`,
          paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
        }}
      >
        <View style={styles.modalContentStyle}>
          <Icon
            name="close-circle"
            type="ionicon"
            color={"rgba(0, 0, 0, 0.7)"}
            containerStyle={styles.closeIconContainerStyle}
            onPress={() => modalRef?.current?.close()}
          />
          <Ionicons
            name="checkbox"
            size={fontUtils.h(35)}
            color={colorSuccess}
            style={styles.notificationIconStyle}
          />
          <Text
            align="center"
            mb={fontUtils.h(15)}
            fontFamily={fontUtils.manrope_semibold}
          >
            {title}
          </Text>
          <Text mb={fontUtils.h(20)} align="center" size={fontUtils.h(12)}>
            {note}
          </Text>
          <View
            style={[
              layoutConstants.styles.rowView,
              layoutConstants.styles.justifyCenter,
            ]}
          >
            <Button
              title={btnCancel}
              onPress={onCancel}
              buttonHeight={fontUtils.h(40)}
              buttonStyle={{
                width: fontUtils.w(120),
              }}
              wrapperStyle={{
                marginRight: fontUtils.w(5),
              }}
              titleStyle={styles.btnTitleStyle}
              type="outline"
            />
            <Button
              title={btnTitle}
              onPress={doDone}
              buttonHeight={fontUtils.h(40)}
              buttonStyle={{
                width: fontUtils.w(120),
              }}
              wrapperStyle={{
                marginLeft: fontUtils.w(5),
              }}
              titleStyle={styles.btnTitleStyle}
            />
          </View>
        </View>
      </View>
    </Modalize>
  );
};

export const ConfirmDeleteModal = ({
  modalRef,
  property,
}: {
  property: PropertyObjectType;
  modalRef?: any;
}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { deleteProperty } = useProperties();
  const closeModal = () => {
    modalRef?.current?.close();
  };
  const doDelete = () => {
    closeModal();
    deleteProperty({
      ids: [property.id],
    });
    dispatch(
      reduxApiRequests.endpoints.getProperty.initiate(property.id, {
        forceRefetch: true,
        subscribe: true,
      }),
    );
    navigation.goBack();
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
    >
      <View
        style={{
          backgroundColor: `transparent`,
          minHeight: `100%`,
          justifyContent: `center`,
          paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
        }}
      >
        <View style={styles.modalContentStyle}>
          <Icon
            name="trash"
            type="ionicon"
            reverse
            size={fontUtils.h(15)}
            color={colorDanger}
            containerStyle={styles.notificationIconStyle}
          />
          <Text
            align="center"
            mb={fontUtils.h(15)}
            fontFamily={fontUtils.manrope_semibold}
          >
            Delete Listing
          </Text>
          <Text mb={fontUtils.h(40)} align="center" size={fontUtils.h(12)}>
            Are you sure you'd like to delete this listing?
          </Text>
          <View style={[layoutConstants.styles.rowView]}>
            <Button
              title={"Yes, delete listing"}
              onPress={doDelete}
              buttonHeight={fontUtils.h(40)}
              backgroundColor={colorDanger}
              wrapperStyle={{
                marginRight: fontUtils.w(5),
                flex: 1,
              }}
              titleStyle={styles.btnTitleStyle}
            />
            <Button
              title={"No, go back"}
              onPress={closeModal}
              type="outline"
              buttonHeight={fontUtils.h(40)}
              wrapperStyle={{
                marginLeft: fontUtils.w(5),
                flex: 1,
              }}
              titleStyle={styles.btnTitleStyle}
            />
          </View>
        </View>
      </View>
    </Modalize>
  );
};

export const MarkPropertySoldModal = ({
  modalRef,
  property,
}: {
  property: PropertyObjectType;
  modalRef?: any;
}) => {
  const navigation = useNavigation();
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
    >
      <View
        style={{
          backgroundColor: `transparent`,
          minHeight: `100%`,
          justifyContent: `center`,
          paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
        }}
      >
        <View style={styles.modalContentStyle}>
          <Ionicons
            name="checkmark-circle"
            size={fontUtils.h(35)}
            color={colorPrimary}
            style={styles.notificationIconStyle}
          />
          <Text
            align="center"
            mb={fontUtils.h(15)}
            fontFamily={fontUtils.manrope_semibold}
          >
            Mark as Sold
          </Text>
          <Text mb={fontUtils.h(40)} align="center" size={fontUtils.h(12)}>
            Are you sure you'd like to mark this listing as sold?
          </Text>
          <View style={[layoutConstants.styles.rowView]}>
            <Button
              title={"No, go back"}
              onPress={closeModal}
              type="outline"
              buttonHeight={fontUtils.h(40)}
              wrapperStyle={{
                marginRight: fontUtils.w(5),
                flex: 1,
              }}
              titleStyle={styles.btnTitleStyle}
            />
            <Button
              title={"Yes, it has been sold"}
              onPress={() => {
                closeModal();
                navigation.navigate("ApartmentSoldScreen", {
                  data: property,
                });
              }}
              buttonHeight={fontUtils.h(40)}
              backgroundColor={colorPrimary}
              wrapperStyle={{
                marginLeft: fontUtils.w(5),
                flex: 1,
              }}
              titleStyle={styles.btnTitleStyle}
            />
          </View>
        </View>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  modalContentStyle: {
    borderRadius: fontUtils.w(12),
    paddingHorizontal: fontUtils.w(15),
    paddingTop: fontUtils.h(10),
    paddingBottom: fontUtils.h(20),
    backgroundColor: colorWhite,
  },
  closeIconContainerStyle: {
    alignSelf: "flex-end",
  },
  notificationIconStyle: {
    alignSelf: "center",
    marginBottom: fontUtils.h(10),
  },
  btnTitleStyle: {
    fontFamily: fontUtils.manrope_regular,
    fontSize: fontUtils.h(12),
  },
});
