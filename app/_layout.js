import "../global.css";
import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { updateService } from "../src/services/updateService";
import { setAuthToken } from "../src/api/index";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Set up authentication for API requests
    // In a real app, you would get this token from secure storage or user login
    // For now, we'll use a placeholder - you should replace this with your actual API key
    const apiKey = "your-api-key-here"; // Replace with your actual API key
    setAuthToken(apiKey);

    // Check for updates when app launches
    updateService.checkForUpdatesOnStartup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "grid"; // Default icon
            if (route.name === "settings") {
              iconName = "settings";
            } else if (route.name === "about") {
              iconName = "information-circle";
            } else if (route.name === "habits") {
              iconName = "list"; // Or any other suitable icon from Ionicons
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="habits" options={{ title: "Habits" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        <Tabs.Screen name="about" options={{ title: "About" }} />
      </Tabs>
    </QueryClientProvider>
  );
}
