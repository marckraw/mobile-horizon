import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { useSomeData } from "../../src/hooks/useSomeData"; // Adjusted path
import { Link } from "expo-router"; // Import Link

export default function HomeScreen() {
  // Example: Pass some parameters to the hook if needed
  const { data, isLoading, isError, error, refetch } = useSomeData({
    mock: true,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MobileHorizon!</Text>
      <Text style={styles.subtitle}>Home Screen - Data from Grid:</Text>

      <View style={styles.linkContainer}>
        <Link href="/updates" style={styles.link}>
          Go to OTA Updates Screen
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
        <Text style={styles.noDataText}>
          No data to display yet. (Or API endpoint /some-endpoint is not yet
          implemented)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: "#ffe0e0",
    padding: 15,
    borderRadius: 8,
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
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  linkContainer: {
    // Styles for the link container
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  link: {
    // Styles for the link text
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});
