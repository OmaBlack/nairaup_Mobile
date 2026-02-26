import { useNavigation } from "@react-navigation/native";
import { Avatar } from "@rneui/themed";
import { Image } from "expo-image";
import moment from "moment";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
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
import { colorPrimary } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import fontUtils from "src/utils/font.utils";

export const ChatListItem = memo(function ChatListItem({
  data,
}: {
  data: any;
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.chatListItemWrapperStyle]}
      onPress={() =>
        navigation.navigate("MessagingScreen", {
          profile: {
            ...data?.connection,
          },
          connectionstring: data?.connectionstring,
        })
      }
    >
      <View style={[layoutConstants.styles.rowView]}>
        <ViewableAvatar
          size={fontUtils.h(35)}
          rounded
          source={{
            uri: data?.connection?.avatarurl,
          }}
          ImageComponent={Image}
        />
        <View>
          <Text ml={fontUtils.w(10)} fontFamily={fontUtils.manrope_medium}>
            {`${data?.connection?.firstname} ${data?.connection?.lastname}`}
          </Text>
          <Text ml={fontUtils.w(10)} size={fontUtils.h(12)} numberOfLines={2}>
            {data?.lastmessage || "No message"}
          </Text>
        </View>
      </View>
      <Text size={fontUtils.h(9)} align="right">
        {moment(data?.lastmessagedatetime).format("MMM DD, YYYY hh:mma")}
      </Text>
    </TouchableOpacity>
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
  chatListItemWrapperStyle: {
    marginBottom: fontUtils.h(10),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    paddingBottom: fontUtils.h(5),
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
