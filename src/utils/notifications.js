// utils/notifications.ts

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function requestNotificationPermission() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function sendExampleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🧠 Gentle Reminder",
      body: "You're doing this for your health. Stay strong today 💪",
    },
    trigger: { seconds: 30 }, // send 30 seconds from now
  });
}
