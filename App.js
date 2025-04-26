import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Alert, Platform } from "react-native";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

export default function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    checkForUpdate();
    getDebugInfo();
  }, []);

  async function getDebugInfo() {
    try {
      const updateCheckResult = await Updates.checkForUpdateAsync();
      setDebugInfo({
        isEmulator: Updates.isEmulator,
        channel: Updates.channel,
        runtimeVersion: Updates.runtimeVersion,
        updateId: Updates.updateId,
        createdAt: Updates.createdAt,
        isEmbeddedLaunch: Updates.isEmbeddedLaunch,
        checkResult: updateCheckResult,
      });
    } catch (error) {
      console.error("Error getting debug info:", error);
    }
  }

  async function checkForUpdate() {
    try {
      setIsChecking(true);
      setUpdateError(null);

      console.log("Current channel:", Updates.channel);
      console.log("Current runtime version:", Updates.runtimeVersion);

      const update = await Updates.checkForUpdateAsync();
      console.log("Update check result:", update);

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
                  const result = await Updates.fetchUpdateAsync();
                  console.log("Fetch result:", result);
                  await Updates.reloadAsync();
                } catch (error) {
                  console.error("Error downloading update:", error);
                  setUpdateError(
                    "Failed to download the update: " + error.message
                  );
                  Alert.alert(
                    "Error",
                    "Failed to download the update. Please try again later."
                  );
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
      setUpdateError("Failed to check for updates: " + error.message);
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
      <View
        style={{ marginVertical: 30, padding: 20, backgroundColor: "#ffeecc" }}
      >
        <Text style={{ fontSize: 22, color: "black", textAlign: "center" }}>
          🎉 This is the NEW OTA Update! 🎉
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            color: "gray",
            textAlign: "center",
          }}
        >
          If you see this box, OTA updates are working!
        </Text>
      </View>
      <StatusBar style="auto" />
      <Text style={styles.status}>
        {isChecking
          ? "Checking for updates..."
          : updateAvailable
          ? "Update available!"
          : "App is up to date"}
      </Text>
      {updateError && <Text style={styles.error}>{updateError}</Text>}
      <Button
        title="Check for Updates"
        onPress={checkForUpdate}
        disabled={isChecking}
      />
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Info:</Text>
        <Text style={styles.debugText}>
          Channel: {debugInfo.channel || "unknown"}
        </Text>
        <Text style={styles.debugText}>
          Runtime Version: {debugInfo.runtimeVersion || "unknown"}
        </Text>
        <Text style={styles.debugText}>
          Update ID: {debugInfo.updateId || "none"}
        </Text>
        <Text style={styles.debugText}>
          Is Emulator: {String(debugInfo.isEmulator)}
        </Text>
        <Text style={styles.debugText}>
          Is Embedded Launch: {String(debugInfo.isEmbeddedLaunch)}
        </Text>
      </View>
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
  error: {
    marginVertical: 10,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
});
