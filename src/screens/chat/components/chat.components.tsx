import { useNavigation } from "@react-navigation/native";
import { Avatar, Badge } from "@rneui/themed";
import { Image } from "expo-image";
import moment from "moment";
import React, { memo, useRef, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import {
  Bubble,
  BubbleProps,
  Composer,
  ComposerProps,
  Day,
  DayProps,
  InputToolbar,
  InputToolbarProps,
  Time,
} from "react-native-gifted-chat";
import {
  Text,
  TouchableOpacity,
  ViewableAvatar,
} from "src/components/themed.components";
import { colorPrimary, colorDanger } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";
import {
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

export const ChatListItem = memo(function ChatListItem({
  data,
  onArchive,
}: {
  data: any;
  onArchive?: (connectionId: string) => void;
}) {
  const navigation = useNavigation();
  const [isArchived, setIsArchived] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const lastGestureX = useRef(0);

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
        },
      },
    ],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      lastGestureX.current = translationX;

      // If swiped left more than 100 pixels, archive immediately
      if (translationX < -100) {
        Animated.timing(translateX, {
          toValue: -500,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setIsArchived(true);
          if (onArchive) {
            onArchive(data?.connectionstring);
          }
        });
      } else {
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  if (isArchived) {
    return null;
  }

  return (
    <View style={styles.chatListItemContainer}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View
          style={[
            styles.animatedView,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.chatListItemWrapperStyle]}
            onPress={() =>
              navigation.navigate("MessagingScreen", {
                profile: {
                  ...data?.connection,
                },
                connectionstring: data?.connectionstring,
                lastmessage: data?.lastmessage,
              })
            }
          >
            <View style={styles.chatListItemRowStyle}>
              <View style={[layoutConstants.styles.rowView, { flex: 1 }]}>
                <ViewableAvatar
                  size={fontUtils.h(35)}
                  rounded
                  source={{
                    uri: data?.connection?.avatarurl,
                  }}
                  ImageComponent={Image}
                />
                <View style={{ flex: 1 }}>
                  <Text ml={fontUtils.w(10)} fontFamily={fontUtils.manrope_medium} numberOfLines={1}>
                    {`${data?.connection?.firstname} ${data?.connection?.lastname}`}
                  </Text>
                  <Text
                    ml={fontUtils.w(10)}
                    size={fontUtils.h(12)}
                    numberOfLines={1}
                    fontFamily={
                      data?.totalunreadmessages > 0
                        ? fontUtils.manrope_semibold
                        : fontUtils.manrope_regular
                    }
                  >
                    {data?.lastmessage || "No message"}
                  </Text>
                </View>
              </View>
              <View style={styles.chatListItemMetaStyle}>
                <Text size={fontUtils.h(9)} align="right">
                  {moment(data?.lastmessagedatetime).format("MMM DD, hh:mma")}
                </Text>
                {data?.totalunreadmessages > 0 && (
                  <Badge
                    value={data.totalunreadmessages}
                    containerStyle={styles.unreadBadgeContainerStyle}
                    badgeStyle={styles.unreadBadgeStyle}
                    textStyle={styles.unreadBadgeTextStyle}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
});

export const ChatInputToolBar = (props: InputToolbarProps<any>) => {
  return (
    <InputToolbar
      containerStyle={styles.inputToolbarContainerStyle}
      // renderAccessory={(accessoryProps) => (
      //   <Icon name="camera" type="ionicon" />
      // )}
      {...props}
    />
  );
};

export const ChatDay = (props: DayProps) => {
  return (
    <Day
      textStyle={styles.bubbleTextStyle}
      wrapperStyle={styles.dayWrapperStyle}
      {...props}
    />
  );
};

export const ChatComposer = (props: ComposerProps) => {
  return (
    <Composer
      placeholder="Message"
      textInputStyle={styles.composerTextInputStyle}
      {...props}
    />
  );
};

export const ChatBubble = (props: BubbleProps<any>) => {
  return (
    <Bubble
      renderTime={(timeProps) => (
        <Time
          timeTextStyle={{
            left: {
              ...styles.timeTextStyle,
            },
            right: {
              ...styles.timeTextStyle,
            },
          }}
          {...timeProps}
        />
      )}
      textStyle={{
        left: {
          ...styles.bubbleTextStyle,
          ...styles.leftBubbleTextStyle,
        },
        right: {
          ...styles.bubbleTextStyle,
          ...styles.rightBubbleTextStyle,
        },
      }}
      wrapperStyle={{
        left: {
          ...styles.bubbleWrapperStyle,
          ...styles.leftBubbleWrapperStyle,
        },
        right: {
          ...styles.bubbleWrapperStyle,
          ...styles.rightBubbleWrapperStyle,
        },
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  chatListItemContainer: {
    overflow: "hidden",
    marginBottom: fontUtils.h(10),
  },
  animatedView: {
    zIndex: 1,
  },
  chatListItemWrapperStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    paddingBottom: fontUtils.h(5),
    backgroundColor: "white",
  },
  chatListItemRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatListItemMetaStyle: {
    alignItems: "flex-end",
    marginLeft: fontUtils.w(8),
  },
  unreadBadgeContainerStyle: {
    marginTop: fontUtils.h(4),
  },
  unreadBadgeStyle: {
    backgroundColor: colorPrimary,
    minWidth: fontUtils.h(18),
    height: fontUtils.h(18),
    borderRadius: fontUtils.h(9),
  },
  unreadBadgeTextStyle: {
    fontSize: fontUtils.h(10),
    fontFamily: fontUtils.manrope_semibold,
  },
  dayWrapperStyle: {
    backgroundColor: "transparent",
  },
  inputToolbarContainerStyle: {
    paddingHorizontal: fontUtils.w(10),
  },
  composerTextInputStyle: {
    backgroundColor: "#EFF5FE",
    minHeight: layoutConstants.inputHeight,
    borderRadius: fontUtils.r(5),
    paddingHorizontal: fontUtils.w(15),
    paddingTop: fontUtils.h(10),
    marginRight: fontUtils.w(10),
    marginLeft: 0,
  },
  sendBtnContainerStyle: {
    width: layoutConstants.inputHeight,
    height: layoutConstants.inputHeight,
    backgroundColor: colorPrimary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: fontUtils.r(5),
    marginBottom: 5,
  },
  bubbleWrapperStyle: {
    backgroundColor: colorPrimary[200],
    marginBottom: fontUtils.h(10),
  },
  leftBubbleWrapperStyle: {
    borderTopLeftRadius: 0,
    backgroundColor: "#EDEFF2",
  },
  rightBubbleWrapperStyle: {
    borderTopRightRadius: 0,
    backgroundColor: "#9DC6FC",
  },
  bubbleTextStyle: {
    fontFamily: fontUtils.manrope_regular,
    fontSize: fontUtils.h(12),
    color: "#000",
  },
  leftBubbleTextStyle: {},
  rightBubbleTextStyle: {},
  timeWrapperStyle: {
    width: "100%",
    paddingHorizontal: fontUtils.w(10),
    marginBottom: fontUtils.h(5),
  },
  timeTextStyle: {
    fontFamily: fontUtils.manrope_light,
    fontSize: fontUtils.h(11),
  },
  actionItemViewStyle: {
    backgroundColor: colorPrimary[100],
    paddingHorizontal: fontUtils.w(6),
    borderRadius: fontUtils.r(12),
  },
});
