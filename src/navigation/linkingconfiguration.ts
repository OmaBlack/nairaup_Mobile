/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "src/types/navigation.types";
// import * as Notifications from 'expo-notifications';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {},
  },
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (url !== null) {
      return url;
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    const eventListenerSubscription = Linking.addEventListener(
      "url",
      onReceiveURL,
    );

    return () => {
      // Clean up the event listeners
      eventListenerSubscription.remove();
    };
  },
};

export default linking;
