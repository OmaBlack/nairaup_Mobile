import { ANDROID_GOOGLE_API_KEY, IOS_GOOGLE_API_KEY } from "@env";
import axios from "axios";
import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";
import SecureStoreManager from "./securestoremanager.utils";

const GOOGLE_API_KEY =
  Platform.OS === "ios" ? IOS_GOOGLE_API_KEY : ANDROID_GOOGLE_API_KEY;

export const openGoogleMapsLocation = async (
  latitude: number,
  longitude: number,
  label = "Location",
) => {
  const scheme = Platform.select({
    ios: "maps:0,0?q=",
    android: "geo:0,0?q=",
  });
  const latLng = `${latitude},${longitude}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  await Linking.openURL(`${url}`);
};

export const getUserCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission to access location was denied");
    return;
  }
  let location = await Location.getCurrentPositionAsync({
    accuracy: 5,
  });
  return location;
};

export const getGooglePlacesPredictions = async (e: string) => {
  const request = await axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=address&input=${encodeURI(
      e.trim(),
    )}&key=${GOOGLE_API_KEY}&components=country:ng`,
  );
  if (request?.data?.status === "OK") {
    return request?.data?.predictions || [];
  } else return [];
};

export const getPhysicalAddressFromCoordinates = async (
  lat?: number,
  long?: number,
  address?: string,
) => {
  const key = `${lat},${long}`;
  const result = await SecureStoreManager.getItemFromAsyncStorage(`${key}`);
  if (result) return JSON.parse(result);
  const req = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&address=${address}&key=${GOOGLE_API_KEY}`,
  );
  if (req?.data?.status === "OK") {
    await SecureStoreManager.saveItemToAsyncStorage(
      `${key}`,
      JSON.stringify(req?.data?.results[0]),
    );
    return req?.data?.results[0];
  }
  // return sampleAddrFromCoorResponse?.results[0]
  else return null;
};

export const getPlaceDetails = async (placeid?: string) => {
  if (placeid) {
    const result = await SecureStoreManager.getItemFromAsyncStorage(
      `${placeid}`,
    );
    if (result) return JSON.parse(result);
  }
  const req = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeid}&key=${GOOGLE_API_KEY}`,
  );
  if (req?.data?.status === "OK") {
    if (placeid)
      await SecureStoreManager.saveItemToAsyncStorage(
        `${placeid}`,
        JSON.stringify(req.data.result),
      );
    return req?.data?.result;
  } else return null;
};

export const calculateDistance = (
  locationA: { lat: number; long: number },
  locationB: { lat: number; long: number },
): number => {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = (locationA.lat * Math.PI) / 180;
  const lon1Rad = (locationA.long * Math.PI) / 180;
  const lat2Rad = (locationB.lat * Math.PI) / 180;
  const lon2Rad = (locationB.long * Math.PI) / 180;

  // Calculate the differences between the latitudes and longitudes
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Haversine formula to calculate distance
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;

  return distance;
};

/**
 * Removes postal codes from a string.
 * Supports common formats like 5-digit US ZIP codes, 5+4 digit US ZIP codes,
 * UK postcodes, Canadian postal codes, and generic numeric codes.
 *
 * @param {string} str - The input string.
 * @returns {string} - The string with postal codes removed.
 */
export const removePostalCodes = (str: string): string => {
  // Regular expression to match common postal code formats
  const postalCodeRegex =
    /(\b\d{5}(?:-\d{4})?\b)|(\b[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}\b)|(\b[A-Z]\d[A-Z] ?\d[A-Z]\d\b)|(\b\d{6}\b)/gi;

  // Remove postal codes from the string
  return str.replace(postalCodeRegex, "").trim();
};
