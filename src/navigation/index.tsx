/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import linking from "./linkingconfiguration";
import { RenderProps, RootStackParamList } from "src/types/navigation.types";
import { AppRoutes } from "src/constants/routes.constants";
import { useAppSelector } from "src/hooks/useReduxHooks";
import CreatePostModal from "src/components/post.create.modal";
import axios from "axios";

export function renderScreen({
  name,
  component,
  options = {},
  initialParams = {},
}: RenderProps) {
  return (
    <Stack.Screen
      name={name}
      key={name}
      options={options}
      component={component}
      initialParams={initialParams}
    />
  );
}

export default function Navigation({
  colorScheme,
  initialRouteName,
}: {
  colorScheme: ColorSchemeName;
  initialRouteName?: keyof RootStackParamList;
}) {
  return (
    <NavigationContainer
      linking={linking}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator initialRouteName={initialRouteName} />
      <CreatePostModal />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator({
  initialRouteName = "OnboardingIntroScreen",
}: {
  initialRouteName?: keyof RootStackParamList;
}) {
  const auth = useAppSelector((state) => state.auth);
  axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;

  return (
    <Stack.Navigator
      screenOptions={{}}
      screenListeners={{
        beforeRemove: (e) => {
          // console.log(e)
        },
        focus: (e) => {
          // console.log(e)
        },
      }}
      initialRouteName={
        auth.token && auth.user.id && auth.user.id ? "App" : initialRouteName
      }
    >
      {AppRoutes(auth).map((route: any) => {
        return renderScreen(route);
      })}
    </Stack.Navigator>
  );
}
