import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

export default function EnvironmentScreen() {
  // Get all environment variables
  const envVars = {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    EXPO_PUBLIC_APP_VARIANT: process.env.EXPO_PUBLIC_APP_VARIANT,
  };

  // Add any other environment variables that might exist
  const allProcessEnv = Object.keys(process.env)
    .filter((key) => key.startsWith("EXPO_PUBLIC_") || key === "NODE_ENV")
    .reduce((obj, key) => {
      obj[key] = process.env[key];
      return obj;
    }, {});

  // Merge with our known vars
  const combinedEnvVars = { ...envVars, ...allProcessEnv };

  const copyToClipboard = async (key, value) => {
    try {
      await Clipboard.setStringAsync(`${key}=${value || "undefined"}`);
      Alert.alert("Copied", `${key} copied to clipboard`);
    } catch (error) {
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const copyAllEnvVars = async () => {
    try {
      const envString = Object.entries(combinedEnvVars)
        .map(([key, value]) => `${key}=${value || "undefined"}`)
        .join("\n");
      await Clipboard.setStringAsync(envString);
      Alert.alert("Copied", "All environment variables copied to clipboard");
    } catch (error) {
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const maskSensitiveValue = (key, value) => {
    if (!value) return "undefined";

    // Mask API keys but show first/last few characters
    if (key.includes("API_KEY") || key.includes("TOKEN")) {
      if (value.length > 8) {
        return `${value.substring(0, 4)}...${value.substring(
          value.length - 4
        )}`;
      }
      return "****";
    }

    return value;
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800">
          Environment Variables
        </Text>
        <TouchableOpacity
          onPress={copyAllEnvVars}
          className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons
            name="copy"
            size={16}
            color="white"
            style={{ marginRight: 4 }}
          />
          <Text className="text-white text-sm font-medium">Copy All</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <View className="flex-row items-center mb-2">
          <Ionicons
            name="warning"
            size={20}
            color="#F59E0B"
            style={{ marginRight: 8 }}
          />
          <Text className="text-yellow-800 font-semibold">
            Debug Information
          </Text>
        </View>
        <Text className="text-yellow-700 text-sm">
          This screen shows environment variables available in your app. API
          keys are masked for security. Use this to debug environment setup.
        </Text>
      </View>

      {Object.entries(combinedEnvVars).map(([key, value]) => (
        <TouchableOpacity
          key={key}
          onPress={() => copyToClipboard(key, value)}
          className="mb-3 p-4 bg-white rounded-lg shadow"
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-sm font-mono text-blue-600 mb-1">
                {key}
              </Text>
              <Text className="text-gray-700 font-mono text-sm">
                {maskSensitiveValue(key, value)}
              </Text>
              {!value && (
                <Text className="text-red-500 text-xs mt-1">⚠ Not defined</Text>
              )}
            </View>
            <View className="flex-row items-center">
              {value ? (
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              ) : (
                <Ionicons name="close-circle" size={20} color="#EF4444" />
              )}
              <Ionicons
                name="copy"
                size={16}
                color="#9CA3AF"
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View className="bg-gray-100 rounded-lg p-4 mt-4">
        <Text className="text-gray-600 text-sm">
          <Text className="font-semibold">Tip:</Text> Tap any variable to copy
          it to clipboard. Environment variables with EXPO_PUBLIC_ prefix are
          available in client-side code.
        </Text>
      </View>
    </ScrollView>
  );
}
