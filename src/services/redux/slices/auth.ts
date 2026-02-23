import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { produce } from "immer";
import { APP_TOKEN, DEFAULT_USER } from "src/constants/app.constants";
import { ReduxAuthState } from "src/types/app.types";
import {
  firebaseSignInWithUserToken,
  firebaseSignOutWithUserToken,
} from "src/utils/firebase.utils";
import SecureStoreManager from "src/utils/securestoremanager.utils";

const initialAuthState: ReduxAuthState = {
  token: "",
  user: DEFAULT_USER,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    populateUserData: (state, action) => {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload?.token}`;
      state = produce(state, (draft) => {
        draft.token = action?.payload?.token;
        draft.user = action?.payload?.user;
      });
      if (action?.payload?.firebaseToken)
        firebaseSignInWithUserToken(action?.payload?.firebaseToken);
      return state;
    },
    updateUserData: (state, action) => {
      state = produce(state, (draft) => {
        draft.user = {
          ...action.payload,
        };
      });
      return state;
    },
    updateUserProfileData: (state, action) => {
      state = produce(state, (draft) => {
        draft.user.profile = {
          ...action.payload,
        };
      });
      return state;
    },
    updateAuthToken: (state, action) => {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload}`;
      state = produce(state, (draft) => {
        draft.token = action?.payload;
      });
      return state;
    },
    logout: (state) => {
      SecureStoreManager.removeItemFromSecureStore(`${APP_TOKEN}`)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
      state = {
        ...state,
        token: null,
        user: {
          ...state.user,
          id: -1,
        },
      };
      firebaseSignOutWithUserToken();
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  logout,
  updateAuthToken,
  populateUserData,
  updateUserData,
  updateUserProfileData,
} = authSlice.actions;

export default authSlice.reducer;
