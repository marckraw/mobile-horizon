import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const router = useRouter();

  const settingsItems = [
    {
      title: "OTA Updates",
      description: "Manage app updates and view update information",
      icon: "refresh-circle",
      onPress: () => router.push("/settings/updates"),
    },
    {
      title: "Environment Variables",
      description: "View environment variables for debugging",
      icon: "terminal",
      onPress: () => router.push("/settings/environment"),
    },
    {
      title: "Placeholder Setting 1",
      description: "Description for setting 1",
      icon: "settings",
      onPress: () => console.log("Setting 1 pressed"),
    },
    {
      title: "Placeholder Setting 2",
      description: "Description for setting 2",
      icon: "cog",
      onPress: () => console.log("Setting 2 pressed"),
    },
  ];

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold mb-6 text-gray-800">
        App Settings
      </Text>

      {settingsItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          className="mb-4 p-4 bg-white rounded-lg shadow flex-row items-center"
        >
          <Ionicons
            name={item.icon}
            size={24}
            color="#6B7280"
            className="mr-3"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-700">
              {item.title}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {item.description}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
