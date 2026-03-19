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

// Debug: Log Firebase config
console.log("🔥 Firebase Config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey?.substring(0, 10) + "..." // Only show first 10 chars for security
});

// Initialize app only if not already initialized
export const firebaseApp = !getApps().length
  ? (() => {
    try {
      return initializeApp(firebaseConfig);
    } catch (error: any) {
      console.error("❌ Firebase app initialization error:", error.message);
      throw error;
    }
  })()
  : getApp();

console.log("✅ Firebase App initialized:", firebaseApp.name);

// Initialize auth only if this is first time
let auth;
try {
  auth = getAuth(firebaseApp);
  if (!auth.currentUser && !auth.emulatorConfig) {
    initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  }
} catch (e) {
  console.log("ℹ️ Auth already initialized, using existing instance");
  auth = getAuth(firebaseApp);
}

export const firebaseSignInWithUserToken = async (token: string) => {
  console.log("🔐 Attempting Firebase custom token sign-in...");
  signInWithCustomToken(auth, token)
    .then((userCredential) => {
      console.log("✅ Firebase custom token sign-in successful");
      // Signed in
      // const user = userCredential.user;
      // console.log(userCredential, user)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("❌ Firebase custom token sign-in failed:", errorCode, errorMessage);
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
