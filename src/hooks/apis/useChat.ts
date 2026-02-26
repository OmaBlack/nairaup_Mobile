import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  limit,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useState } from "react";
import { requestClan } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";
import firestoreDb from "src/utils/firebase.utils";

export const useConnection = () => {
  const [loading, setLoading] = useState(false);
  const createConnection = async (
    data: {
      connectionid?: number;
      waitforresponse?: boolean;
    },
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request = await requestClan({
      route: `connections`,
      type: "POST",
      data,
      showToast: false,
    });
    setLoading(false);
    cb();
    return request;
  };

  const updateConnection = async (
    pathParams: {
      connectionstring: string;
    },
    data: {
      lastmessage?: string;
      openchat?: boolean;
    },
    cb = () => {},
  ): Promise<NetworkResponse> => {
    setLoading(true);
    const request = await requestClan({
      route: `connections`,
      type: "PUT",
      pathParams,
      data,
      showToast: false,
    });
    setLoading(false);
    cb();
    return request;
  };
  return { createConnection, updateConnection, loading };
};

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const saveChat = async (
    path: string,
    data: any,
    cb = () => {},
  ): Promise<any> => {
    let saved = false;
    try {
      setLoading(true);
      const _Collection = collection(firestoreDb, path);
      await addDoc(_Collection, data);
      setLoading(false);
      cb();
      saved = true;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      return saved;
    }
  };
  const deleteChat = async (
    path: string,
    _id: string,
    cb = () => {},
  ): Promise<any> => {
    let deleted = false;
    try {
      setLoading(true);
      const _Collection = collection(firestoreDb, path);
      const searchChat = query(_Collection, where("_id", "==", _id));
      const querySnapshot = await getDocs(searchChat);
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(firestoreDb, path, document.id));
      });
      setLoading(false);
      cb();
      deleted = true;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      return deleted;
    }
  };
  return { saveChat, loading, deleteChat };
};

export const useCreateChat = () => {
  const [loading, setLoading] = useState(false);
  const createChat = async (
    path: string,
    path_2: string,
    data: {
      createdAt: Date;
      user: {
        _id: string;
        name: string;
        avatar: string;
      };
    },
    data_2: {
      createdAt: Date;
      user: {
        _id: string;
        name: string;
        avatar: string;
      };
    },
    cb = () => {},
  ): Promise<any> => {
    try {
      setLoading(true);
      const _Collection = collection(firestoreDb, path);
      const searchChat = query(
        _Collection,
        where("user._id", "==", `${data_2.user._id}`),
      );
      const chatExist = await getDocs(searchChat);
      if (chatExist.docs.length < 1) {
        await addDoc(_Collection, data_2);
      }
      const _Collection_2 = collection(firestoreDb, path_2);
      const searchChat_2 = query(
        _Collection_2,
        where("user._id", "==", `${data.user._id}`),
      );
      const chatExist_2 = await getDocs(searchChat_2);
      if (chatExist_2.docs.length < 1) {
        await addDoc(_Collection_2, data);
      }
      setLoading(false);
      cb();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      return null;
    }
  };
  return { createChat, loading };
};

export const useChatMessages = () => {
  const [loading, setLoading] = useState(false);
  const getMessages = async (chatId: string, cb = () => {}): Promise<any> => {
    setLoading(true);
    const messagesCollection = collection(
      firestoreDb,
      `chats/${chatId}/messages`,
    );
    const sorted = query(
      messagesCollection,
      orderBy("firebaseCreatedAt", "desc"),
    );
    const request = await getDocs(sorted);
    const messages = request.docs.map((doc) => doc.data());
    setLoading(false);
    cb();
    return messages;
  };
  return { getMessages, loading };
};

export const useGetChats = () => {
  const [loading, setLoading] = useState(false);
  const chats = async (
    path: string,
    queryParam?: {
      limit?: number;
    },
    cb = () => {},
  ): Promise<any> => {
    setLoading(true);
    const _Collection = collection(firestoreDb, path);
    const filtered = query(
      _Collection,
      limit(queryParam?.limit || 50),
      orderBy("createdAt", "desc"),
    );
    const request = await getDocs(filtered);
    const list = request.docs.map((doc) => {
      return {
        id: doc.id,
        chat: doc.data(),
      };
    });
    setLoading(false);
    cb();
    return list;
  };
  return { chats, loading };
};
