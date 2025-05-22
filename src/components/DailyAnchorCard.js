// components/DailyAnchorCard.tsx

import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";

export default function DailyAnchorCard() {
  const [showSupport, setShowSupport] = useState(false);

  return (
    <View className="p-4 rounded-2xl bg-black space-y-3">
      <Text className="text-white text-xl font-semibold">
        🎯 Today’s Anchor
      </Text>
      <Text className="text-gray-300 text-sm">
        You’re doing this to survive. You’re doing this because your body
        deserves healing.
      </Text>

      {showSupport && (
        <Text className="text-lime-300 text-sm mt-2">
          Pause. Breathe. You’re still in control. Slip ≠ failure.
        </Text>
      )}

      <View className="flex-row space-x-2 pt-2">
        <Pressable
          onPress={() => Alert.alert("✅ Fast logged")}
          className="bg-lime-600 rounded-xl px-3 py-2"
        >
          <Text className="text-white text-sm">Log Fast</Text>
        </Pressable>

        <Pressable
          onPress={() => Alert.alert("🍕 Slip logged")}
          className="bg-yellow-400 rounded-xl px-3 py-2"
        >
          <Text className="text-black text-sm">Log Slip</Text>
        </Pressable>

        <Pressable
          onPress={() => setShowSupport(true)}
          className="bg-slate-800 rounded-xl px-3 py-2"
        >
          <Text className="text-white text-sm">I'm Slipping</Text>
        </Pressable>
      </View>
    </View>
  );
}
