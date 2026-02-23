import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export default function useCachedResources() {
  const [fontsLoaded] = useFonts({
    ...FontAwesome.font,
    "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),

    "manrope-bold": require("../assets/fonts/Manrope/Manrope-Bold.ttf"),
    "manrope-extrabold": require("../assets/fonts/Manrope/Manrope-ExtraBold.ttf"),
    "manrope-extralight": require("../assets/fonts/Manrope/Manrope-ExtraLight.ttf"),
    "manrope-light": require("../assets/fonts/Manrope/Manrope-Light.ttf"),
    "manrope-medium": require("../assets/fonts/Manrope/Manrope-Medium.ttf"),
    "manrope-regular": require("../assets/fonts/Manrope/Manrope-Regular.ttf"),
    "manrope-semibold": require("../assets/fonts/Manrope/Manrope-SemiBold.ttf"),
  });

  return fontsLoaded;
}
