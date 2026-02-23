// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_TOKEN_COUNTRIES, COUNTRIES_API_URL } from "@env";
import {
  GLOBAL_RTK_CACHE_EMPTY_DURATION,
  GLOBAL_RTK_REFETCH_DURATION,
} from "src/constants/app.constants";
import { makeUrlKeyValuePairs } from "src/services/request";
import { NetworkResponse } from "src/types/request.types";
import { GlobalQueryDto } from "src/types/query.types";

// Define a service using a base URL and expected endpoints
export const countriesReduxApiRequests = createApi({
  reducerPath: "countriesApiRequests",
  baseQuery: fetchBaseQuery({
    baseUrl: `${COUNTRIES_API_URL}`,
    prepareHeaders: async (headers) => {
      headers.set("Authorization", `Bearer ${AUTH_TOKEN_COUNTRIES}`);
      headers.set("App_Bundle_Id", `${process.env.APP_BUNDLE_ID}`);
      return headers;
    },
  }),
  keepUnusedDataFor: GLOBAL_RTK_CACHE_EMPTY_DURATION,
  refetchOnMountOrArgChange: GLOBAL_RTK_REFETCH_DURATION,
  endpoints: (builder) => ({
    getStates: builder.query<
      NetworkResponse,
      GlobalQueryDto & {
        name?: string;
        countrycode?: string;
        iso2?: string;
        countryid?: string;
      }
    >({
      query: (queryParams) => ({
        url: `states${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),
    getCities: builder.query<
      NetworkResponse,
      GlobalQueryDto & {
        name?: string;
        stateid?: string;
      }
    >({
      query: (queryParams) => ({
        url: `cities${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),
    getLGAs: builder.query<
      NetworkResponse,
      GlobalQueryDto & {
        name?: string;
        stateid?: string;
      }
    >({
      query: (queryParams) => ({
        url: `lgas${makeUrlKeyValuePairs(queryParams)}`,
      }),
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetStatesQuery, useGetCitiesQuery, useGetLGAsQuery } =
  countriesReduxApiRequests;
