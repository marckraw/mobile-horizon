import "../global.css"; // Import the global CSS file
import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="updates" options={{ title: "OTA Updates" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        <Tabs.Screen name="about" options={{ title: "About" }} />
      </Tabs>
    </QueryClientProvider>
  );
}
