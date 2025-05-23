import "../global.css";
import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "grid"; // Default icon
            if (route.name === "updates") {
              iconName = "calendar";
            } else if (route.name === "settings") {
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
        <Tabs.Screen name="updates" options={{ title: "OTA Updates" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        <Tabs.Screen name="about" options={{ title: "About" }} />
      </Tabs>
    </QueryClientProvider>
  );
}
