import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  useHabits,
  useDeleteHabit,
  useLogHabitProgress,
} from "../src/hooks/useHabits";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

export default function HabitsScreen() {
  const { data: habits = [], isLoading, error } = useHabits();
  const deleteHabitMutation = useDeleteHabit();
  const logProgressMutation = useLogHabitProgress();

  const [editingHabitId, setEditingHabitId] = useState(null);

  const handleLogProgress = async (habitId, progress) => {
    try {
      await logProgressMutation.mutateAsync({
        habitId,
        progress: Math.round(progress),
        date: null, // Use current date
      });
    } catch (error) {
      Alert.alert("Error", `Failed to log progress: ${error.message}`);
    }
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
          try {
            await deleteHabitMutation.mutateAsync(habitId);
          } catch (error) {
            Alert.alert("Error", `Failed to delete habit: ${error.message}`);
          }
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
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading habits...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-4">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-red-500 text-center mt-4 text-lg font-semibold">
          Error loading habits
        </Text>
        <Text className="text-red-400 text-center mt-2">{error.message}</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => window.location.reload()} // Temporary reload solution
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate statistics - handle potential data structure differences
  const completedToday = habits.filter((h) => {
    // Assuming the backend might return different progress structures
    const progress = h.progress || h.todayProgress || 0;
    return progress >= 100;
  }).length;

  const longestStreak =
    habits.length > 0 ? Math.max(0, ...habits.map((h) => h.streak || 0)) : 0;

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
        {habits.length === 0 ? (
          <View className="bg-white rounded-lg p-8 items-center">
            <Ionicons
              name="checkmark-circle-outline"
              size={48}
              color="#9CA3AF"
            />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No habits yet
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Create your first habit to start tracking your progress
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {habits.map((habit) => {
              // Handle potential data structure differences from backend
              const habitProgress = habit.progress || habit.todayProgress || 0;
              const habitTarget = habit.target || 100;
              const habitStreak = habit.streak || 0;
              const habitName = habit.name || "Unknown Habit";
              const habitId = habit.id || habit._id;

              return (
                <View
                  key={habitId}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View>
                      <Text className="text-lg font-semibold text-gray-800">
                        {habitName}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Target: {habitTarget}%
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      {habitStreak > 0 && (
                        <View className="bg-amber-100 px-2 py-1 rounded-full mr-2">
                          <Text className="text-xs text-amber-700 font-medium">
                            🔥 {habitStreak} day{habitStreak > 1 ? "s" : ""}
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={() => handleDeleteHabit(habitId)}
                        className="ml-2"
                        disabled={deleteHabitMutation.isPending}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={
                            deleteHabitMutation.isPending
                              ? "#9CA3AF"
                              : "#ef4444"
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="flex-row items-center space-x-3 mb-2">
                    <Slider
                      className="flex-1 h-10"
                      minimumValue={0}
                      maximumValue={habitTarget}
                      value={habitProgress}
                      onValueChange={(value) =>
                        handleLogProgress(habitId, value)
                      }
                      disabled={logProgressMutation.isPending}
                      minimumTrackTintColor={
                        habitProgress >= habitTarget ? "#22c55e" : "#3b82f6"
                      }
                      maximumTrackTintColor="#e5e7eb"
                    />
                    <Text className="text-sm font-medium text-gray-600 w-12 text-right">
                      {Math.round(habitProgress)}%
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleCompleteClick(habitId)}
                    disabled={
                      logProgressMutation.isPending ||
                      habitProgress >= habitTarget
                    }
                    className={`mt-2 p-2 rounded-md ${
                      habitProgress >= habitTarget
                        ? "bg-green-100"
                        : "bg-blue-100"
                    } ${logProgressMutation.isPending ? "opacity-50" : ""}`}
                  >
                    <Text
                      className={`text-center font-medium ${
                        habitProgress >= habitTarget
                          ? "text-green-700"
                          : "text-blue-700"
                      }`}
                    >
                      {logProgressMutation.isPending
                        ? "Logging..."
                        : habitProgress >= habitTarget
                        ? "Completed"
                        : "Mark Complete"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
