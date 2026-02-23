import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth";
import jobsReducer from "./jobs";
import { reduxApiRequests } from "../apis";
import { unAuthReduxApiRequests } from "../apis/unauth.api.requests";
import { countriesReduxApiRequests } from "../apis/countries.api.requests";

const reducers = {
  auth: authReducer,
  jobs: jobsReducer,

  apiRequests: reduxApiRequests.reducer,
  unAuthApiRequests: unAuthReduxApiRequests.reducer,
  countriesApiRequests: countriesReduxApiRequests.reducer,
};

export default combineReducers(reducers);
