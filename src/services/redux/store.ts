import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer from "./slices";
import { reduxApiRequests } from "./apis";
import { PERSIST_CONFIG_KEY } from "@env";
import { unAuthReduxApiRequests } from "./apis/unauth.api.requests";
import { countriesReduxApiRequests } from "./apis/countries.api.requests";

const persistConfig = {
  key: `${PERSIST_CONFIG_KEY}`,
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      immutableCheck: false,
    })
      .concat(reduxApiRequests.middleware)
      .concat(unAuthReduxApiRequests.middleware)
      .concat(countriesReduxApiRequests.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
