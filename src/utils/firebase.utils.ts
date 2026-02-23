import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import {
  signInWithCustomToken,
  signOut,
  initializeAuth,
  //@ts-ignore
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "src/constants/firebase.constants";

export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const firebaseSignInWithUserToken = async (token: string) => {
  signInWithCustomToken(auth, token)
    .then((userCredential) => {
      // Signed in
      // const user = userCredential.user;
      // console.log(userCredential, user)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error, errorCode, errorMessage);
    });
};

export const firebaseSignOutWithUserToken = async () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
};

const firestoreDb = initializeFirestore(firebaseApp, {
  localCache: memoryLocalCache({}),
});

export default firestoreDb;
