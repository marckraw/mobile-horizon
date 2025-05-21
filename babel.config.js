module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Ensure babel-preset-expo is applied before nativewind/babel
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Required for expo-router
      "expo-router/babel",
      // Reanimated plugin has to be listed last.
      "react-native-reanimated/plugin",
    ],
  };
};
