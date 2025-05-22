import { ScrollView, Text } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">About MobileHorizon</Text>
      <Text className="text-base text-gray-700">
        MobileHorizon is a minimal Expo application showcasing over-the-air
        updates using expo-updates and EAS. It includes example screens for OTA
        updates and application settings.
      </Text>
    </ScrollView>
  );
}
