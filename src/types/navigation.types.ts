/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { FunctionComponent } from "react";
import { ProfileObjectType } from "./app.types";
import {
  PropertyCategoryType,
  PropertyObjectType,
  PropertyType,
} from "./properties.types";
import { JobObjectType } from "./jobs.types";
import { ImagePickerAsset } from "expo-image-picker";
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = AuthScreensParamList &
  RootTabParamList & {
    Root: NavigatorScreenParams<StackParamList> | undefined;
    App: NavigatorScreenParams<RootTabParamList> | undefined;
    AppBeforeAuth: undefined;

    HomeTabScreen: undefined;
    ExploreTabScreen: undefined;

    ApartmentViewScreen: {
      data: PropertyObjectType;
    };
    ApartmentEditScreen: {
      data: PropertyObjectType;
    };
    ApartmentSoldScreen: {
      data: PropertyObjectType;
    };
    ApartmentRateBuyerScreen: {
      id: number;
    };
    ProviderViewScreen: {
      profile: ProfileObjectType & {
        user: {
          email: string;
          mobile: string;
        };
      };
    };
    ProviderAroundScreen: {
      providerType?: string;
    };
    HotelViewScreen: {
      data: PropertyObjectType;
    };
    HotelReserveScreen: {
      id: number;
      room: any;
    };
    HotelReserveSuccessScreen: {
      note: string;
      title?: string;
    };
    JobViewScreen: {
      data: JobObjectType;
    };
    JobApplyScreen: {
      id: number;
    };
    SettingsScreen: undefined;
    ProfileEditScreen: undefined;
    SavedItemsScreen: undefined;
    AllJobsScreen: undefined;
    SavedJobsScreen: undefined;
    AppliedJobsScreen: undefined;
    PasswordEditScreen: undefined;
    AllPurchasesScreen: undefined;
    MessagingScreen: {
      profile: Partial<ProfileObjectType>;
      connectionstring: string;
    };
    ChatListScreen: undefined;

    NotificationTabScreen: undefined;
    ProfileTabScreen: undefined;

    ApartmentCreateScreen: {
      type: "apartment" | "hotel" | "job";
    };
    ApartmentCreateNextScreen: {
      type: "apartment" | "hotel" | "job";
    };
    ApartmentCreateDocsScreen: {
      type: "apartment" | "hotel" | "job";
      data: {
        title: string;
        description: string;
        address: string;
        type: PropertyType;
        category: PropertyCategoryType;
        price: string;
        features: number[];
        images: ImagePickerAsset[];
        geolocation?: string;
        state?: string;
        country?: string;
        city?: string;
      };
    };
    ApartmentRoomsAddScreen: {
      id: number;
      title: string;
    };
    JobCreateNextScreen: undefined;
    HotelReservationViewScreen: {
      data: any;
    };
    ReviewsScreen: undefined;
    TransactionsScreen: undefined;
    PasswordSecurityScreen: undefined;
    AccountManagementScreen: undefined;
    PinEditScreen: undefined;
    HelpCenterScreen: undefined;
  };

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type StackParamList = AuthScreensParamList & RootTabParamList;

export type AuthScreensParamList = {
  OnboardingIntroScreen: undefined;

  LoginScreen: undefined;
  CreateAccountScreen: undefined;
  OTPVerificationScreen: {
    email?: string;
    mobile?: string;
    isEmail?: boolean;
    isPasswordReset?: boolean;
  };
  AccountSuccessScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: undefined;
};

export type RootTabParamList = {
  HomeTabNavigator: undefined;
  ExploreTabNavigator: undefined;
  NotificationsTabNavigator: undefined;
  ProfileTabNavigator: undefined;
  PostTabNavigator: undefined;
};

export type CombinedTabsParamList = RootTabParamList;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type RenderProps = {
  name: keyof RootStackParamList;
  component: FunctionComponent<any>;
  options: NativeStackNavigationOptions;
  initialParams: any;
};
