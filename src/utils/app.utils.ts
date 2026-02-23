import * as Linking from "expo-linking";
import moment from "moment";
import { Share } from "react-native";
import { colorPrimary } from "src/constants/colors.constants";

export const GetGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 17) {
    return "Good afternoon";
  } else if (currentHour < 21) {
    return "Good evening";
  } else {
    return "Good night";
  }
};

export const RemoveItemAtIndex = (array: any[], index: number) => {
  return array.filter((_, i) => i !== index);
};

export const MsToTime = (milliseconds: number) => {
  // Check if the input is a valid number
  if (
    typeof milliseconds !== "number" ||
    isNaN(milliseconds) ||
    milliseconds < 0
  ) {
    return "00:00:00";
  }

  // Calculate total seconds, rounding down
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Helper function to pad single-digit numbers with a leading zero
  const pad = (num: number) => String(num).padStart(2, "0");

  // Format the time as hh:mm:ss
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const CallEmergency = async () => {
  await Linking.openURL("tel:999");
};

export const OpenTandC = async () =>
  await Linking.openURL("https://staging.nairaup.com/terms-and-conditions");

export const OpenPrivacy = async () =>
  await Linking.openURL("https://staging.nairaup.com/privacy-policy");

export const AppShareContent = async (message: string, title: string) => {
  try {
    const shareResult = await Share.share(
      {
        message,
        title,
      },
      {
        dialogTitle: "NairaUp",
        subject: "NairaUp",
        tintColor: colorPrimary,
      },
    );
    if (shareResult.action === Share.sharedAction) {
      // showToast({
      //   title: `Share`,
      //   message: `Thank you for sharing ${PRODUCT_NAME}`,
      //   type: `success`,
      //   duration: 2,
      // });
      if (shareResult.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
      return true;
    } else if (shareResult.action === Share.dismissedAction) {
      // dismissed
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(error);
  }
};

export const TimeAgo = (date: any) => {
  let momentAgo = "";
  try {
    const _timeAgo = moment(date)
      // .utc(true)
      .fromNow()
      .replace("weeks", "wks")
      .replace("months", "mons")
      .replace("years", "yrs")
      .replace("hours", "hrs")
      .replace("minutes", "mins")
      .replace("seconds", "secs");
    return _timeAgo;
    let currentDate = moment().utc(false).toDate();
    let dateAgo = new Date(date);
    let years = currentDate.getFullYear() - dateAgo.getFullYear();
    let months = currentDate.getMonth() - dateAgo.getMonth();
    let days = currentDate.getDate() - dateAgo.getDate();
    let hours = currentDate.getHours() - dateAgo.getHours();
    let minutes = currentDate.getMinutes() - dateAgo.getMinutes();
    let seconds = currentDate.getSeconds() - dateAgo.getSeconds();
    if (dateAgo > currentDate) momentAgo = "Date error";
    else {
      if (years > 0) momentAgo = `${years} ${years > 1 ? "years" : "year"} ago`;
      else if (months > 0)
        momentAgo = `${months} ${months > 1 ? "months" : "month"} ago`;
      else if (days > 0) momentAgo = `${days} ${days > 1 ? "days" : "day"} ago`;
      else if (days < 0) momentAgo = "a month ago";
      else if (hours > 0)
        momentAgo = `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
      else if (minutes > 0)
        momentAgo = `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
      else if (seconds > 0)
        momentAgo = `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
    }
    return momentAgo;
  } catch (error) {
    console.warn(error);
    return "Date error";
  }
};

export const CapitalizeFirstLetter = (sentence: string) => {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

/**
 * Interface defining the structure of the input objects.
 * K is a generic type representing the keys of the object (the field names).
 * V is a generic type representing the values of the object fields.
 */
interface DataObject<K extends string | number | symbol = string, V = any> {
  [key: string]: V;
}

/**
 * Transforms an array of objects into a single object (a map or dictionary).
 * The key for each new entry is taken from the specified field of the source object.
 *
 * @template T The type of the objects in the input array. Must extend DataObject.
 * @template K The type of the key used for indexing. Must be a key of T and the value must be a string or number.
 *
 * @param {T[]} data - The input array of JSON-like objects.
 * @param {K} field - The key of the field whose value will be used as the index (key) in the output object.
 * @returns {Record<string | number, T>} A new object where keys are the values of the specified field,
 * and values are the original objects from the array.
 */
export function indexArrayByField<T extends DataObject, K extends keyof T>(
  data: T[],
  field: K,
): Record<string | number, T> {
  // Use the reduce method to iterate over the array and accumulate the result object.
  const indexedObject = data.reduce((acc, currentObject) => {
    // Retrieve the value of the specified field. This will be the key.
    const key = currentObject[field];

    // TypeScript ensures that the key is safe to use as an object index
    // if it's a primitive like string or number.
    if (typeof key === "string" || typeof key === "number") {
      acc[key] = currentObject;
    } else {
      // Optional: Handle cases where the field value is not a string or number
      // or is missing/null/undefined, though the type definition helps prevent this.
      console.warn(
        `Skipping object: The value of field '${String(
          field,
        )}' is not a string or number. Value: ${key}`,
      );
    }
    return acc;
  }, {} as Record<string | number, T>);

  return indexedObject;
}
