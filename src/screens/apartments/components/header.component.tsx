import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Icon, Text, TouchableOpacity } from "src/components/themed.components";
import { colorDanger, colorPrimary } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { AppShareContent } from "src/utils/app.utils";
import fontUtils, { deivceWidth, deviceHeight } from "src/utils/font.utils";
import { ConfirmDeleteModal, MarkPropertySoldModal } from "./modal.components";
import { Modalize } from "react-native-modalize";
import { ScreenHeader } from "src/components/headers.components";
import { useAppDispatch, useAppSelector } from "src/hooks/useReduxHooks";
import { PropertyObjectType } from "src/types/properties.types";
import useProperties from "src/hooks/apis/useProperties";
import { reduxApiRequests } from "src/services/redux/apis";

export const ApartmentScreenHeader = ({
  property,
}: {
  property: PropertyObjectType;
}) => {
  const { id } = useAppSelector((state) => state.auth.user.profile);
  return (
    <ScreenHeader
      title={""}
      rightComponent={
        id === property.profile.id ? (
          <RightComponentMenu property={property} />
        ) : (
          <></>
        )
      }
    />
  );
};

const RightComponentMenu = ({ property }: { property: PropertyObjectType }) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const deleteModalRef = useRef<Modalize>(null);
  const markSoldModalRef = useRef<Modalize>(null);
  const [showMenu, setShowMenu] = useState(false);

  const { updateProperty } = useProperties();

  const doShare = async () => {
    setTimeout(async () => {
      await AppShareContent("Title", "Item");
    }, 100);
  };

  const doMarkAsSold = async () => {
    markSoldModalRef.current?.open();
    await updateProperty(property.id, {
      marksold: true,
    });
    dispatch(
      reduxApiRequests.endpoints.getProperty.initiate(property.id, {
        forceRefetch: true,
        subscribe: true,
      }),
    );
  };

  return (
    <View>
      <Icon
        name="ellipsis-vertical"
        type="ionicon"
        color={"#000"}
        onPress={() => setShowMenu(true)}
      />
      <Modal visible={showMenu} transparent>
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuBackdropStyle}>
            <View style={styles.menuWrapperStyle}>
              {[
                {
                  label: "Edit Listing",
                  icon: (
                    <Ionicons
                      name="pencil"
                      color={colorPrimary}
                      size={fontUtils.h(15)}
                    />
                  ),
                  onPress: () =>
                    navigation.navigate("ApartmentEditScreen", {
                      data: property,
                    }),
                },
                {
                  label: "Promote Listing",
                  icon: (
                    <Entypo
                      name="share"
                      color={colorPrimary}
                      size={fontUtils.h(15)}
                    />
                  ),
                  onPress: doShare,
                },
                {
                  label: "Mark Sold",
                  icon: (
                    <Ionicons
                      name="checkmark-circle"
                      color={colorPrimary}
                      size={fontUtils.h(18)}
                    />
                  ),
                  onPress: doMarkAsSold,
                },
                {
                  label: "Delete Listing",
                  icon: (
                    <Ionicons
                      name="trash"
                      color={colorDanger}
                      size={fontUtils.h(15)}
                    />
                  ),
                  onPress: () => deleteModalRef.current?.open(),
                },
              ].map((menu) => (
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    menu.onPress();
                  }}
                  style={[layoutConstants.styles.rowView, styles.menuViewStyle]}
                  key={menu.label}
                >
                  {menu.icon}
                  <Text ml={fontUtils.w(12)}>{menu.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <ConfirmDeleteModal property={property} modalRef={deleteModalRef} />
      <MarkPropertySoldModal property={property} modalRef={markSoldModalRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  menuWrapperStyle: {
    position: "absolute",
    right: layoutConstants.mainViewHorizontalPadding,
    top: fontUtils.h(80),
    backgroundColor: "#FFF7E6",
    borderRadius: fontUtils.r(5),
    paddingHorizontal: fontUtils.w(15),
    paddingVertical: fontUtils.h(12),
    zIndex: 999,
    ...layoutConstants.card,
  },
  menuViewStyle: {
    marginVertical: fontUtils.h(10),
  },
  menuBackdropStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: deivceWidth,
    height: deviceHeight,
  },
});
