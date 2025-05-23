import "../global.css";
import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { updateService } from "../src/services/updateService";
import { setAuthToken, API_KEY } from "../src/api/index";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Set up authentication for API requests using environment variable
    if (API_KEY) {
      setAuthToken(API_KEY);
      console.log("API token set from environment variables");
    } else {
      console.warn("EXPO_PUBLIC_API_KEY not found in environment variables");
    }

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
