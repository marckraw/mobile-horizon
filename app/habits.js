import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useHabits } from "../src/hooks/useHabits";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

export default function HabitsScreen() {
  const { data: habits = [], isLoading, error } = useHabits();

  const [editingHabitId, setEditingHabitId] = useState(null);
  const [progressUpdatingHabitId, setProgressUpdatingHabitId] = useState(null);

  const handleLogProgress = async (habitId, progress) => {
    setProgressUpdatingHabitId(habitId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProgressUpdatingHabitId(null);
    // In the future, this will call the actual API
    console.log(`Logged progress for habit ${habitId}: ${progress}%`);
  };

  const handleDeleteHabit = async (habitId) => {
    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          // In the future, this will call the actual API
          console.log(`Deleted habit ${habitId}`);
        },
      },
    ]);
  };

  const handleCompleteClick = async (habitId) => {
    await handleLogProgress(habitId, 100);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-4">
        <Text className="text-red-500 text-center">
          Error loading habits: {error.message}
        </Text>
      </View>
    );
  }

  const completedToday = habits.filter((h) => h.progress === 100).length;
  const longestStreak = Math.max(0, ...habits.map((h) => h.streak || 0));

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Text className="text-3xl font-bold mb-6 text-gray-800">
          Habits Tracker
        </Text>

        {/* Statistics Card */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold mb-4 text-gray-800">
            Habit Statistics
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total Habits:</Text>
              <Text className="font-medium">{habits.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Completed Today:</Text>
              <Text className="font-medium">{completedToday}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Longest Streak:</Text>
              <Text className="font-medium">{longestStreak} days</Text>
            </View>
          </View>
        </View>

        {/* Habits List */}
        <View className="space-y-4">
          {habits.map((habit) => (
            <View key={habit.id} className="bg-white rounded-lg p-4 shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {habit.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Target: {habit.target}%
                  </Text>
                </View>
                <View className="flex-row items-center">
                  {habit.streak > 0 && (
                    <View className="bg-amber-100 px-2 py-1 rounded-full mr-2">
                      <Text className="text-xs text-amber-700 font-medium">
                        🔥 {habit.streak} day{habit.streak > 1 ? "s" : ""}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDeleteHabit(habit.id)}
                    className="ml-2"
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row items-center space-x-3 mb-2">
                <Slider
                  style={{ flex: 1, height: 40 }}
                  minimumValue={0}
                  maximumValue={100}
                  value={habit.progress}
                  onValueChange={(value) => handleLogProgress(habit.id, value)}
                  disabled={progressUpdatingHabitId === habit.id}
                  minimumTrackTintColor={
                    habit.progress === 100 ? "#22c55e" : "#3b82f6"
                  }
                  maximumTrackTintColor="#e5e7eb"
                />
                <Text className="text-sm font-medium text-gray-600 w-12 text-right">
                  {habit.progress}%
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleCompleteClick(habit.id)}
                disabled={
                  progressUpdatingHabitId === habit.id || habit.progress === 100
                }
                className={`mt-2 p-2 rounded-md ${
                  habit.progress === 100 ? "bg-green-100" : "bg-blue-100"
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    habit.progress === 100 ? "text-green-700" : "text-blue-700"
                  }`}
                >
                  {progressUpdatingHabitId === habit.id
                    ? "Logging..."
                    : habit.progress === 100
                    ? "Completed"
                    : "Mark Complete"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
