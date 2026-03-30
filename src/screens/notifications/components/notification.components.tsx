import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { memo } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Modalize } from "react-native-modalize";
import { Button } from "src/components/buttons.components";
import { Icon, Text, TouchableOpacity } from "src/components/themed.components";
import { colorSuccess, colorWhite } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { useMarkNotificationsReadMutation } from "src/services/redux/apis";
import { NotificationObjectType } from "src/types/notifications.types";
import fontUtils from "src/utils/font.utils";
import { PanGestureHandler, State } from "react-native-gesture-handler";

export const NotificationItem = memo(function NotificationItem({
  data,
  onArchive,
}: {
  data: NotificationObjectType;
  onArchive?: (id: string) => void;
}) {
  const [markRead] = useMarkNotificationsReadMutation();
  const [status, setStatus] = useState(data.status);
  const [isArchived, setIsArchived] = useState(false);
  
  const translateX = useRef(new Animated.Value(0)).current;

  const modalRef = useRef<Modalize>(null);
  
  const viewNotification = () => {
    modalRef.current?.open();
    if (status === "pending")
      markRead({ ids: [data.id] }).then((r: any) => {
        if (!r.error) {
          setStatus("read");
        }
      });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const shouldArchive = event.nativeEvent.translationX < -100;
      
      console.log(`🎯 Notification swipe detected, translationX: ${event.nativeEvent.translationX}`);

      if (shouldArchive) {
        console.log(`✋ Swipe threshold reached! Archiving notification ${data.id}...`);
        Animated.timing(translateX, {
          toValue: -500,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          console.log(`💾 Setting isArchived to true for notification ${data.id}`);
          setIsArchived(true);
          if (onArchive) {
            console.log(`📤 Calling onArchive callback with: ${data.id.toString()}`);
            onArchive(data.id.toString());
          }
        });
      } else {
        console.log(`↩️ Not enough swipe, snapping back`);
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (isArchived) {
    return null;
  }

  return (
    <View style={styles.containerWrapper}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={-10}
      >
        <Animated.View style={{ transform: [{ translateX }] }}>
          <TouchableOpacity
            style={[styles.wrapperStyle]}
            onPress={viewNotification}
            activeOpacity={0.7}
          >
            <Ionicons
              name={status === "read" ? "checkmark-circle-outline" : "ellipse"}
              size={fontUtils.h(20)}
              color={colorSuccess}
            />
            <View style={[styles.mainContentStyle]}>
              <Text size={fontUtils.h(12)} fontFamily={fontUtils.manrope_semibold}>
                {data.title}
              </Text>
              <Text size={fontUtils.h(10)} mt={fontUtils.h(3)}>
                {data.notification}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
      <ViewNotificationModal data={data} modalRef={modalRef} />
    </View>
  );
});

export const ViewNotificationModal = ({
  data,
  modalRef,
}: {
  data: NotificationObjectType;
  modalRef?: any;
}) => {
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
            name="checkmark-circle-outline"
            size={fontUtils.h(35)}
            color={colorSuccess}
            style={styles.notificationIconStyle}
          />
          <Text
            align="center"
            mb={fontUtils.h(15)}
            fontFamily={fontUtils.manrope_semibold}
          >
            {data.title}
          </Text>
          <Text mb={fontUtils.h(20)} align="center" size={fontUtils.h(12)}>
            {data.notification}
          </Text>
          {data.type === "propertyrejected" ? (
            <View
              style={[layoutConstants.styles.rowView, styles.btnsViewStyle]}
            >
              <Button
                title={"Go Back"}
                buttonHeight={fontUtils.h(40)}
                titleStyle={styles.btnTitleStyle}
                type="outline"
                buttonStyle={styles.backBtnStyle}
              />
              <Button
                title={"Contact Admin"}
                buttonHeight={fontUtils.h(40)}
                titleStyle={styles.btnTitleStyle}
                wrapperStyle={styles.okBtnStyle}
              />
            </View>
          ) : null}
        </View>
      </View>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    marginBottom: fontUtils.h(15),
  },
  wrapperStyle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: fontUtils.r(10),
    paddingHorizontal: fontUtils.w(10),
    paddingVertical: fontUtils.h(10),
    backgroundColor: colorWhite,
  },
  mainContentStyle: {
    marginLeft: fontUtils.w(10),
    flex: 1,
  },
  modalContentStyle: {
    borderRadius: fontUtils.w(12),
    paddingHorizontal: fontUtils.w(15),
    paddingVertical: fontUtils.h(10),
    backgroundColor: colorWhite,
  },
  btnTitleStyle: {
    fontFamily: fontUtils.manrope_regular,
    fontSize: fontUtils.h(12),
  },
  btnsViewStyle: {},
  backBtnStyle: {
    paddingHorizontal: fontUtils.w(20),
  },
  okBtnStyle: {
    flex: 1,
    marginLeft: fontUtils.w(15),
  },
  closeIconContainerStyle: {
    alignSelf: "flex-end",
  },
  notificationIconStyle: {
    alignSelf: "center",
    marginBottom: fontUtils.h(10),
  },
});
