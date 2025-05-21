import "../global.css"; // Import the global CSS file
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="updates" options={{ title: "OTA Updates" }} />
      </Stack>
    </QueryClientProvider>
  );
}
