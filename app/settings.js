import { View, Text, ScrollView } from "react-native";

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold mb-6 text-gray-800">
        App Settings
      </Text>

      {/* TODO: replace placeholder with real settings component */}
      <View className="mb-4 p-4 bg-white rounded-lg shadow">
        <Text className="text-lg font-semibold text-gray-700">
          Placeholder Setting 1
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Description for setting 1
        </Text>
      </View>

      <View className="mb-4 p-4 bg-white rounded-lg shadow">
        <Text className="text-lg font-semibold text-gray-700">
          Placeholder Setting 2
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Description for setting 2
        </Text>
      </View>
    </ScrollView>
  );
}
