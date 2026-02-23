module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
          ],
          alias: {
            src: "./src",
            underscore: "lodash",
          },
        },
      ],
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
      }],
      'react-native-worklets/plugin',
    ],
  };
};
