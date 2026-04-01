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

      // Load cache immediately for instant display while Firestore loads
      SecureStoreManager.getItemFromAsyncStorage(`${connectionstring}`).then(
        (json) => {
          const res = JSON.parse(json || "{}");
          const cachedData = res?.data || [];
          if (cachedData.length > 0) {
            setMessages(cachedData);
          }
          updateConnection(
            { connectionstring: `${connectionstring}` },
            { totalunreadmessages: 0 },
          );
        },
      );

      // Single real-time listener — no date filter, no race condition
      // onSnapshot delivers ALL existing docs as "added" on first subscribe,
      // then fires again whenever any message is added/changed.
      const messagesCollection = collection(firestoreDb, chatPath);
      const _query = query(
        messagesCollection,
        orderBy("firebaseCreatedAt", "asc"),
      );
      const unsubscribe = onSnapshot(
        _query,
        { includeMetadataChanges: false },
        (snapshot) => {
          // Build the full list from every document in the snapshot
          const allMessages = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            // Convert Firestore Timestamp → JS Date for GiftedChat
            const createdAt =
              data.firebaseCreatedAt?.toDate?.()
              ?? (data.createdAt ? new Date(data.createdAt) : new Date());
            return {
              ...data,
              _id: data._id || docSnap.id,
              createdAt,
              user: data.user ?? { _id: "unknown", name: "", avatar: "" },
            };
          });
          // GiftedChat expects newest-first (descending) ordering
          allMessages.sort((a, b) => {
            const tA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
            const tB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
            return tB - tA;
          });
          setMessages(allMessages);
        },
      );

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

  const onSend = useCallback((messages: any = []) => {
    updateConnection(
      { connectionstring: `${connectionstring}` },
      { lastmessage: messages[0].text },
    );
    // Store the raw JS Date as firebaseCreatedAt so Firestore converts it to
    // a Timestamp that can be sorted and queried correctly.
    const messageToSave = {
      ...messages[0],
      _id: messages[0]._id,
      createdAt: messages[0].createdAt instanceof Date
        ? messages[0].createdAt.toISOString()
        : `${messages[0].createdAt}`,
      firebaseCreatedAt: messages[0].createdAt instanceof Date
        ? messages[0].createdAt
        : new Date(messages[0].createdAt),
      sent: true,
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
