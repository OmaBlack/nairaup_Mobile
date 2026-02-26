import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import { Icon, SafeAreaView } from "src/components/themed.components";
import ChatHeader from "./components/header.component";
import { GiftedChat } from "react-native-gifted-chat";
import {
  ChatBubble,
  ChatComposer,
  ChatDay,
  ChatInputToolBar,
} from "./components/chat.components";
import { colorPrimary, colorWhite } from "src/constants/colors.constants";
import fontUtils from "src/utils/font.utils";
import { useFocusEffect } from "@react-navigation/native";
import SecureStoreManager from "src/utils/securestoremanager.utils";
import moment from "moment";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import firestoreDb from "src/utils/firebase.utils";
import { useChat, useConnection } from "src/hooks/apis/useChat";
import { useAppDispatch, useAppSelector } from "src/hooks/useReduxHooks";
import layoutConstants from "src/constants/layout.constants";
import { reduxApiRequests } from "src/services/redux/apis";

export default function MessagingScreen({
  navigation,
  route,
}: RootStackScreenProps<"MessagingScreen">) {
  const { profile } = useAppSelector((state) => state.auth.user);
  const connectionstring = route.params.connectionstring;
  const chatPath = `chats/${connectionstring}/messages`;
  const dispatch = useAppDispatch();

  const { saveChat } = useChat();
  const { updateConnection } = useConnection();

  const [messages, setMessages] = useState<any[]>([]);
  const [lastSavedMessageDateTime, setLastSavedMessageDateTime] =
    useState<Date | null>(null);

  const chatMessages: any = useMemo(() => {
    return messages;
  }, [messages]);

  useFocusEffect(
    useCallback(() => {
      dispatch(
        reduxApiRequests.endpoints.getConnectionsSummary.initiate(
          {
            //@ts-ignore
            profileid: profile.id,
          },
          {
            forceRefetch: true,
            subscribe: true,
          },
        ),
      );
      SecureStoreManager.getItemFromAsyncStorage(`${connectionstring}`).then(
        (json) => {
          const res = JSON.parse(json || "{}");
          const data = res?.data || [];
          const lastMessageDateAndTime = res?.lastMessageDateAndTime
            ? res?.lastMessageDateAndTime
            : moment().subtract(1, "year").unix();
          setLastSavedMessageDateTime(lastMessageDateAndTime);
          setMessages([...data]);
        },
      );
      const unsubscribe = async () => {};
      return () => unsubscribe();
    }, [connectionstring]),
  );

  const saveChatsToHistory = async () => {
    await SecureStoreManager.saveItemToAsyncStorage(
      `${connectionstring}`,
      JSON.stringify({
        lastMessageDateAndTime: chatMessages[0]?.time || moment().unix(),
        data: chatMessages,
      }),
    );
  };

  useEffect(() => {
    saveChatsToHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages]);
  useEffect(() => {
    if (lastSavedMessageDateTime !== null) {
      const messagesCollection = collection(firestoreDb, chatPath);
      const _query = query(
        messagesCollection,
        where("time", ">", lastSavedMessageDateTime),
        orderBy("time", "asc"),
      );
      const listener = onSnapshot(
        _query,
        {
          includeMetadataChanges: true,
        },
        (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const data: any = change.doc.data();
            if (change.type === "added") {
              const newMessage = [
                {
                  ...data,
                  received: true,
                },
              ];
              setMessages((previousMessages: any) =>
                GiftedChat.append(previousMessages, newMessage),
              );
            }
          });
        },
      );

      return () => {
        listener();
      };
    }
  }, [lastSavedMessageDateTime, chatPath]);

  const onSend = useCallback((messages: any = []) => {
    saveChat(chatPath, {
      ...messages[0],
      createdAt: `${messages[0].createdAt}`,
      time: moment().unix(),
      firebaseCreatedAt: messages[0].createdAt,
      sent: true,
    })
      .then((saved: boolean) => {
        if (saved) {
          updateConnection(
            {
              connectionstring: `${connectionstring}`,
            },
            {
              lastmessage: messages[0].text,
            },
          );
        }
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader {...route.params} />
      <GiftedChat
        messages={messages}
        onSend={(messages: any) => onSend(messages)}
        renderAvatar={null}
        user={{
          _id: profile.id,
          name: `${profile.firstname} ${profile.lastname}`,
          avatar: profile.avatarurl,
        }}
        renderBubble={(props) => <ChatBubble {...props} />}
        renderDay={(props) => <ChatDay {...props} />}
        renderComposer={(props) => (
          <ChatComposer
            {...props}
            textInputProps={{
              maxLength: 500,
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <ChatInputToolBar
            renderSend={(sendProps) => (
              <Icon
                name="send"
                type="font-awesome"
                onPress={() =>
                  //@ts-ignore
                  sendProps?.onSend(
                    {
                      text: sendProps?.text?.trim(),
                    },
                    true,
                  )
                }
                color={colorWhite}
                size={fontUtils.h(20)}
                containerStyle={styles.sendBtnContainerStyle}
              />
            )}
            // renderSend={(sendProps) => (
            //   <Icon
            //     name={"send"}
            //     type="ionicon"
            //     onPress={() =>
            //       //@ts-ignore
            //       sendProps?.onSend(
            //         {
            //           text: sendProps?.text?.trim(),
            //         },
            //         true,
            //       )
            //     }
            //     color={colorPrimary}
            //     containerStyle={styles.sendIconContainerStyle}
            //   />
            // )}
            {...props}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  sendIconContainerStyle: {
    marginBottom: fontUtils.h(8),
    marginRight: fontUtils.w(10),
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
});
