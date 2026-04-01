import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import {
  signInWithCustomToken,
  signInAnonymously,
  signOut,
  initializeAuth,
  //@ts-ignore
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "src/constants/firebase.constants";

// Initialize app only if not already initialized
export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize auth — must call initializeAuth BEFORE getAuth to set persistence
let auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // Already initialized on hot reload
  auth = getAuth(firebaseApp);
}

export const firebaseSignInWithUserToken = async (token: string) => {
  try {
    await signInWithCustomToken(auth, token);
  } catch (error: any) {
    try {
      await signInAnonymously(auth);
    } catch (anonError: any) {
      // silent
    }
  }
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
