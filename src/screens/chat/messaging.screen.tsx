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
import { useChat, useConnection, useChatMessages } from "src/hooks/apis/useChat";
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
  const { getMessages } = useChatMessages();

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
            deleted: 0,
          },
          {
            forceRefetch: true,
            subscribe: true,
          },
        ),
      );
      SecureStoreManager.getItemFromAsyncStorage(`${connectionstring}`).then(
        async (json) => {
          const res = JSON.parse(json || "{}");
          const cachedData = res?.data || [];
          const lastMessageDateAndTime =
            cachedData.length > 0 && res?.lastMessageDateAndTime
              ? res.lastMessageDateAndTime
              : moment().subtract(1, "year").unix();
          setLastSavedMessageDateTime(lastMessageDateAndTime);
          // Always show cache immediately so screen is never blank
          setMessages([...cachedData]);
          // Then try to fetch all messages from Firestore on top
          try {
            const allMessages = await getMessages(connectionstring);
            if (allMessages && allMessages.length > 0) {
              // Sort messages in ascending order (oldest first) for GiftedChat
              const sortedMessages = allMessages.sort((a: any, b: any) => {
                const timeA = a.firebaseCreatedAt?.toMillis?.() || new Date(a.firebaseCreatedAt).getTime() || a.time || 0;
                const timeB = b.firebaseCreatedAt?.toMillis?.() || new Date(b.firebaseCreatedAt).getTime() || b.time || 0;
                return timeA - timeB;
              });
              setMessages(sortedMessages);
            }
          } catch (error) {
            console.error("Error fetching messages from Firestore:", error);
            // Keep showing cached data if fetch fails
          }
          updateConnection(
            { connectionstring: `${connectionstring}` },
            { totalunreadmessages: 0 },
          );
        },
      );
      const unsubscribe = async () => {};
      return () => unsubscribe();
    }, [connectionstring]),
  );

  const saveChatsToHistory = async () => {
    // Never overwrite the cache with an empty message list – this would
    // corrupt lastMessageDateAndTime and cause future loads to miss messages.
    if (chatMessages.length === 0) return;
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
        where("firebaseCreatedAt", ">", new Date(lastSavedMessageDateTime)),
        orderBy("firebaseCreatedAt", "asc"),
      );
      const listener = onSnapshot(
        _query,  
        { includeMetadataChanges: false },
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data: any = change.doc.data();
            if (change.type === "added") {
              // Only add if not already present (deduplicate)
              setMessages((previousMessages: any) => {
                const exists = previousMessages.some((msg: any) => msg._id === data._id);
                if (exists) return previousMessages;
                
                // Ensure message has proper structure for GiftedChat
                const formattedMessage = {
                  ...data,
                  _id: data._id || data.createdAt,
                  received: data.sent ? false : true, // Only mark as received if it wasn't sent by current user
                };
                return GiftedChat.append(previousMessages, [formattedMessage]);
              });
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
    updateConnection(
      { connectionstring: `${connectionstring}` },
      { lastmessage: messages[0].text },
    );
    
    // Ensure message has all required fields for proper Firestore storage and retrieval
    const messageToSave = {
      ...messages[0],
      _id: messages[0]._id || messages[0].createdAt,
      createdAt: `${messages[0].createdAt}`,
      firebaseCreatedAt: messages[0].createdAt,
      time: moment().unix(), // Unix timestamp for listener query
      sent: true,
      received: false,
    };
    
    saveChat(chatPath, messageToSave);
  }, [chatPath, connectionstring, saveChat, updateConnection]);

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
