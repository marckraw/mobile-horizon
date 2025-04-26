import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

export default function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkForUpdate();
  }, []);

  async function checkForUpdate() {
    try {
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
        Alert.alert(
          "Update Available",
          "A new version is available. Would you like to update now?",
          [
            {
              text: "Update",
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                } catch (error) {
                  Alert.alert("Error", "Failed to download the update.");
                  console.error("Error downloading update:", error);
                }
              },
            },
            {
              text: "Later",
              style: "cancel",
            },
          ]
        );
      } else {
        setUpdateAvailable(false);
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      Alert.alert(
        "Error",
        "Failed to check for updates. Please try again later."
      );
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text>🚀 Mobile Horizon v0.0.4 🚀</Text>
      <StatusBar style="auto" />
      <Text style={styles.status}>
        {isChecking
          ? "Checking for updates..."
          : updateAvailable
          ? "Update available!"
          : "App is up to date"}
      </Text>
      <Button
        title="Check for Updates"
        onPress={checkForUpdate}
        disabled={isChecking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    marginVertical: 20,
    color: "#666",
  },
});
