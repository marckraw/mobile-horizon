import React from "react";
import { View, Text, ScrollView } from "react-native";
import DailyAnchorCard from "../src/components/DailyAnchorCard";

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-gray-100 px-4 pt-6"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Good day! 👋
        </Text>
        <Text className="text-gray-600">
          Start your day with focus and intention
        </Text>
      </View>

      {/* Daily Anchor Card */}
      <DailyAnchorCard />

      {/* Optional: Future content sections can go here */}
      <View className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Welcome to MobileHorizon
        </Text>
        <Text className="text-gray-600 leading-relaxed">
          Your personal productivity companion. Track your habits, stay updated,
          and maintain focus on what matters most.
        </Text>
      </View>
    </ScrollView>
  );
}
