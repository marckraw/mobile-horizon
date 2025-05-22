import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Svg, Circle } from "react-native-svg";

const ProgressCircle = ({
  progress = 0.6,
  number = 1,
  size = 40,
  strokeWidth = 4,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - circumference * progress;

  return (
    <View
      style={{ width: size, height: size }}
      className="justify-center items-center"
    >
      <Svg width={size} height={size}>
        <Circle
          stroke="#555"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#fff"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <Text className="absolute text-white font-bold text-sm">{number}</Text>
    </View>
  );
};

const CardContainer = ({ children, className }) => (
  <LinearGradient
    colors={["#2d2d2d", "#1f1f1f"]}
    className={`rounded-xl p-4 mb-4 ${className}`}
  >
    {children}
  </LinearGradient>
);

const DOTS_COUNT = 42;

export default function HomeScreen() {
  const dots = Array.from({ length: DOTS_COUNT });
  const intensities = [
    "bg-gray-600",
    "bg-gray-500",
    "bg-gray-400",
    "bg-gray-700",
  ];

  return (
    <ScrollView
      className="flex-1 bg-black px-4 pt-10"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-white">Workouts</Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-700 justify-center items-center">
            <Ionicons name="filter" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-700 justify-center items-center">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Workout cards grid */}
      <View className="flex-row flex-wrap justify-between">
        <CardContainer className="w-[48%] relative">
          <TouchableOpacity className="absolute top-2 right-2">
            <Ionicons name="settings-outline" size={16} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg">Chest + tricep</Text>
          <Text className="text-gray-400 mb-4">Fridays</Text>
          <ProgressCircle progress={0.4} number={1} />
        </CardContainer>

        <CardContainer className="w-[48%] relative">
          <TouchableOpacity className="absolute top-2 right-2">
            <Ionicons name="settings-outline" size={16} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg">Body weight</Text>
          <Text className="text-gray-400">31 min ago</Text>
          <Text className="text-white text-3xl font-extrabold mt-2">
            190 lbs
          </Text>
        </CardContainer>
      </View>

      {/* Calendar tracker card */}
      <CardContainer className="w-full">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row space-x-3">
            <Text className="text-gray-300">Jan</Text>
            <Text className="text-gray-300">Feb</Text>
            <Text className="text-gray-300">Mar</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <View className="w-6 h-6 rounded-full bg-gray-700 justify-center items-center">
              <Text className="text-white text-xs font-bold">2</Text>
            </View>
            <Ionicons name="settings-outline" size={16} color="white" />
          </View>
        </View>
        <View className="flex-row flex-wrap mb-4">
          {dots.map((_, i) => (
            <View
              key={i}
              className={`w-3 h-3 m-1 rounded-full ${
                intensities[i % intensities.length]
              }`}
            />
          ))}
        </View>
        <Text className="text-white font-bold">Back + bicep + legs</Text>
        <Text className="text-gray-400">Mondays</Text>
      </CardContainer>

      {/* Volume lifted card */}
      <CardContainer className="w-full flex-row justify-between items-center relative">
        <TouchableOpacity className="absolute top-2 right-2">
          <Ionicons name="settings-outline" size={16} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-white font-bold text-lg">Volume lifted</Text>
          <Text className="text-gray-400">Last 7 days</Text>
        </View>
        <Text className="text-white text-3xl font-extrabold">3,200 lbs</Text>
      </CardContainer>

      {/* Empty slot card */}
      <CardContainer className="w-full items-center justify-center">
        <Ionicons name="add" size={32} color="white" />
      </CardContainer>
    </ScrollView>
  );
}
