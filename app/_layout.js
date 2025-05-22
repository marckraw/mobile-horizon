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
            let icon = "grid";
            if (route.name === "updates") icon = "calendar";
            else if (route.name === "settings") icon = "stats-chart";
            else if (route.name === "about") icon = "chatbubble-ellipses";
            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="updates" options={{ title: "OTA Updates" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        <Tabs.Screen name="about" options={{ title: "About" }} />
      </Tabs>
    </QueryClientProvider>
  );
}
