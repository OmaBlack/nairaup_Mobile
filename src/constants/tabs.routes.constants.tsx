import React from "react";
import { ScreenHeader } from "src/components/headers.components";
import ExploreTabScreen from "src/screens/exploretab";
import HomeTabScreen from "src/screens/hometab";
import HomeTabHeader from "src/screens/hometab/components/header.component";
import NotificationsScreen from "src/screens/notifications";
import ProfileTabScreen from "src/screens/profiletab";
import ProfileTabHeader from "src/screens/profiletab/components/header.component";
import { RenderProps } from "src/types/navigation.types";

export const HomeTabRoutes: RenderProps[] = [
  {
    name: "HomeTabScreen",
    component: HomeTabScreen,
    options: {
      header: () => <HomeTabHeader />,
    },
    initialParams: {},
  },
];

export const ExploreTabRoutes: RenderProps[] = [
  {
    name: "HomeTabScreen",
    component: ExploreTabScreen,
    options: { headerShown: false },
    initialParams: {},
  },
];

export const NotificationsTabRoutes: RenderProps[] = [
  {
    name: "NotificationTabScreen",
    component: NotificationsScreen,
    options: {
      header: () => <ScreenHeader title={""} backBtnTitle="Notifications" />,
    },
    initialParams: {},
  },
];

export const ProfileTabRoutes: RenderProps[] = [
  {
    name: "ProfileTabScreen",
    component: ProfileTabScreen,
    options: { headerShown: false },
    initialParams: {},
  },
];
