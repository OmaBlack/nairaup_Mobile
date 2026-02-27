export const expo = {
  name: 'NairaUp',
  displayName: "Nairaup",
  slug: "nairaup",
  version: "0.0.1",
  orientation: "portrait",
  icon: "./src/assets/images/icon.jpg",
  scheme: "nairaup",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FFF"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  newArchEnabled: true,
  ios: {
    usesAppleSignIn: true,
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST,
    supportsTablet: true,
    bundleIdentifier: "com.nairaup.app",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      LSApplicationQueriesSchemes: ["btravel"]
    }
  },
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.jpg",
      backgroundColor: "#FFF"
    },
    package: "com.nairaup.app",
  },
  extra: {
    eas: {
      projectId: "b100f54a-55d8-4c63-b2d4-90f1d7458863"
    },
  },
  plugins: [
    "expo-font",
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-notifications",
      {
        "icon": "./src/assets/images/icon.jpg",
        "color": `#0452C0`
      }
    ],
    [
      "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": `Turning on your location allows NairaUp recommend apartments and hotels near you`,
        "isIosBackgroundLocationEnabled": true,
        "isAndroidBackgroundLocationEnabled": true,
        "locationWhenInUsePermission": `Turning on your location allows NairaUp recommend apartments and hotels near you`
      }
    ],
    ["@react-native-community/datetimepicker"],
    [
      "expo-document-picker",
      {
        "iCloudContainerEnvironment": "Production"
      }
    ],
    [
      "expo-splash-screen",
      {
        "backgroundColor": "#FEEBCA",
        "image": "./src/assets/images/splash-icon.png",
        "dark": {
          "image": "./src/assets/images/splash-icon.png",
          "backgroundColor": "#FEEBCA"
        },
        "imageWidth": 200
      }
    ],
    [
      "@react-native-google-signin/google-signin"
    ],
  ],
  hooks: {
  },
  experiments: {
    typedRoutes: true
  }
};
