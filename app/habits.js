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
import { Ionicons } from "@expo/vector-icons";

export default function HabitsScreen() {
  const { data: habits = [], isLoading, error, refetch } = useHabits();
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

  const handleCompleteClick = async (habitId, progress, target) => {
    // Toggle between 0% and 100% (target)
    const newProgress = progress >= target ? 0 : target;
    await handleLogProgress(habitId, newProgress);
  };

  const handleRetry = async () => {
    try {
      await refetch();
    } catch (error) {
      Alert.alert("Error", "Failed to retry. Please check your connection.");
    }
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
          onPress={handleRetry}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate statistics - handle potential data structure differences
  // Ensure habits is always an array to prevent filter/map errors
  const habitsArray = Array.isArray(habits) ? habits : [];

  const completedToday = habitsArray.filter((h) => {
    // Assuming the backend might return different progress structures
    const progress = h.progress || h.todayProgress || 0;
    return progress >= 100;
  }).length;

  const longestStreak =
    habitsArray.length > 0
      ? Math.max(0, ...habitsArray.map((h) => h.streak || 0))
      : 0;

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-gray-800">
            Habits Tracker
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
            disabled={isLoading}
          >
            <Ionicons
              name="refresh"
              size={16}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white font-medium">
              {isLoading ? "Loading..." : "Refresh"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Card */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold mb-4 text-gray-800">
            Habit Statistics
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total Habits:</Text>
              <Text className="font-medium">{habitsArray.length}</Text>
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
        {habitsArray.length === 0 ? (
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
          <View>
            {habitsArray.map((habit) => {
              // Handle potential data structure differences from backend
              const habitProgress = habit.progress || habit.todayProgress || 0;
              const habitTarget = habit.target || 100;
              const habitStreak = habit.streak || 0;
              const habitName = habit.name || "Unknown Habit";
              const habitId = habit.id || habit._id;

              return (
                <View
                  key={habitId}
                  className="bg-white rounded-lg p-4 shadow-sm mb-4"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800">
                        {habitName}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Target: {habitTarget}% • Progress:{" "}
                        {Math.round(habitProgress)}%
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

                  <TouchableOpacity
                    onPress={() =>
                      handleCompleteClick(habitId, habitProgress, habitTarget)
                    }
                    disabled={logProgressMutation.isPending}
                    className={`p-4 rounded-lg flex-row items-center justify-between ${
                      habitProgress >= habitTarget
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-gray-100 border-2 border-gray-300"
                    } ${logProgressMutation.isPending ? "opacity-50" : ""}`}
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name={
                          habitProgress >= habitTarget
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={24}
                        color={
                          habitProgress >= habitTarget ? "#059669" : "#6B7280"
                        }
                        style={{ marginRight: 12 }}
                      />
                      <View>
                        <Text
                          className={`font-semibold ${
                            habitProgress >= habitTarget
                              ? "text-green-700"
                              : "text-gray-700"
                          }`}
                        >
                          {logProgressMutation.isPending
                            ? "Updating..."
                            : habitProgress >= habitTarget
                            ? "Completed Today"
                            : "Mark as Complete"}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Tap to{" "}
                          {habitProgress >= habitTarget ? "undo" : "complete"}
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        habitProgress >= habitTarget
                          ? "bg-green-200"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          habitProgress >= habitTarget
                            ? "text-green-800"
                            : "text-gray-600"
                        }`}
                      >
                        {Math.round(habitProgress)}%
                      </Text>
                    </View>
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
