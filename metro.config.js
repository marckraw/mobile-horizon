const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Add polyfills and custom config
config.resolver = {
  ...config.resolver,
  sourceExts: ["jsx", "js", "ts", "tsx", "json", "cjs", "mjs"],
  extraNodeModules: {
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
    assert: require.resolve("assert/"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url/"),
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    fs: false,
    net: false,
    tls: false,
    child_process: false,
  },
};

module.exports = config;
