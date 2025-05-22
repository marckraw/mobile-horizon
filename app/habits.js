import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import habitsData from "../src/data/habits.json";

export default function HabitsScreen() {
  const handlePressHabit = (habit) => {
    // For now, just log to console. Later this will log the habit.
    console.log("Pressed habit:", habit.name);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePressHabit(item)}
      className="p-4 border-b border-gray-200 bg-white shadow-sm rounded-lg mb-2 mx-4"
    >
      <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
      <Text className="text-sm text-gray-600">Frequency: {item.frequency}</Text>
      <Text className="text-sm text-gray-600">Goal: {item.goal}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 pt-4">
      <Text className="text-2xl font-bold text-center mb-6 text-gray-700">
        My Habits
      </Text>
      <FlatList
        data={habitsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
