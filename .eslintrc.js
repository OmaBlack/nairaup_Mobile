// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname
  },
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ['.*.js', '*.config.js'],
  rules: {
    "prettier/prettier": "error",
    "import/no-unresolved": "off"
  },
  settings: {
    "import/resolver": {}
  }
};
