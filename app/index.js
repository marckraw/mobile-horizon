import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { useSomeData } from "../src/hooks/useSomeData"; // Adjusted path
import { Link } from "expo-router"; // Import Link

export default function HomeScreen() {
  // Example: Pass some parameters to the hook if needed
  const { data, isLoading, isError, error, refetch } = useSomeData({
    mock: true,
  });

  return (
    <View className="flex-1 justify-center items-center p-5 bg-slate-100">
      <Text className="text-3xl font-bold mb-2 text-slate-800">
        Welcome to MobileHorizon!
      </Text>
      <Text className="text-lg text-gray-600 mb-5">
        Home Screen - Data from Grid:
      </Text>

      <View style={styles.linkContainer}>
        <Link href="/updates" style={styles.link}>
          Go to OTA Updates Screen
        </Link>
        <Link href="/settings" style={styles.link}>
          Go to Settings
        </Link>
      </View>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      {isError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error fetching data:</Text>
          <Text style={styles.errorDetails}>
            {error?.message || "Unknown error"}
          </Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      )}

      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Data Received:</Text>
          {/* Render your data here - this is just a placeholder */}
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}

      {!isLoading && !data && !isError && (
        <Text className="text-base text-gray-500 text-center">
          No data to display yet. (Or API endpoint /some-endpoint is not yet
          implemented)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: "center",
    backgroundColor: "#ffe0e0",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  errorDetails: {
    fontSize: 14,
    color: "darkred",
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  dataContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e0ffe0",
    borderRadius: 8,
    width: "90%",
  },
  dataText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  linkContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  link: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});
