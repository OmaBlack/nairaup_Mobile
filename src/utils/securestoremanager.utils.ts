import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SecureStoreManager = {
  getItemFromSecureStore: async (key: string) => {
    try {
      const val = await SecureStore.getItemAsync(`${key}`);
      return val;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  saveItemToSecureStore: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(`${key}`, `${value}`);
    } catch (error) {
      console.log(error);
    }
  },
  removeItemFromSecureStore: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(`${key}`);
    } catch (error) {
      console.log(error);
    }
  },
  getItemFromAsyncStorage: async (key: string) => {
    try {
      const val = await AsyncStorage.getItem(`${key}`);
      return val;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  saveItemToAsyncStorage: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(`${key}`, `${value}`);
    } catch (error) {
      console.log(error);
    }
  },
  removeItemAsyncStorage: async (key: string) => {
    try {
      await AsyncStorage.removeItem(`${key}`);
    } catch (error) {
      console.log(error);
    }
  },
};

export default SecureStoreManager;
