import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Alert, Platform } from "react-native";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

export default function UpdatesScreen() {
  // Renamed to UpdatesScreen
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // We might want to reconsider automatically checking for updates
    // when this screen is loaded, or provide a button to initiate.
    // For now, keeping original behavior.
    checkForUpdate();
    getDebugInfo();
  }, []);

  async function getDebugInfo() {
    try {
      const updateCheckResult = await Updates.checkForUpdateAsync(); // This might be redundant if checkForUpdate also gets it
      setDebugInfo({
        isEmulator: Updates.isEmulator,
        channel: Updates.channel,
        runtimeVersion: Updates.runtimeVersion,
        updateId: Updates.updateId,
        createdAt: Updates.createdAt
          ? new Date(Updates.createdAt).toLocaleString()
          : "N/A",
        isEmbeddedLaunch: Updates.isEmbeddedLaunch,
        // checkResult: updateCheckResult, // Storing the whole object might be too much for display
        isUpdateAvailable: updateCheckResult.isAvailable, // More direct info
        manifest: updateCheckResult.manifest
          ? JSON.stringify(updateCheckResult.manifest, null, 2)
          : "N/A",
      });
    } catch (error) {
      console.error("Error getting debug info:", error);
      setDebugInfo((prev) => ({ ...prev, errorGettingInfo: error.message }));
    }
  }

  async function checkForUpdate() {
    try {
      setIsChecking(true);
      setUpdateError(null);

      console.log("Current channel:", Updates.channel);
      console.log("Current runtime version:", Updates.runtimeVersion);
      console.log("Update ID:", Updates.updateId);
      console.log("Is Embedded Launch:", Updates.isEmbeddedLaunch);
      console.log("Created At:", Updates.createdAt);

      const update = await Updates.checkForUpdateAsync();
      console.log("Update check result:", update);

      if (update.isAvailable) {
        setUpdateAvailable(true);
        Alert.alert(
          "Update Available",
          `A new version (${
            update.manifest?.version || "unknown"
          }) is available. Would you like to update now?`,
          [
            {
              text: "Update",
              onPress: async () => {
                try {
                  setIsChecking(true); // Indicate loading during fetch/reload
                  setUpdateError(null);
                  console.log("Fetching update...");
                  const result = await Updates.fetchUpdateAsync();
                  console.log("Fetch result:", result);
                  if (result.isNew) {
                    console.log("Reloading app...");
                    await Updates.reloadAsync();
                  } else {
                    Alert.alert(
                      "No New Update",
                      "The update was fetched, but it's not newer than the current version."
                    );
                    setUpdateAvailable(false); // Reset since it wasn\'t new
                  }
                } catch (error) {
                  console.error("Error downloading or applying update:", error);
                  setUpdateError(
                    "Failed to download/apply the update: " + error.message
                  );
                  Alert.alert(
                    "Error",
                    "Failed to download or apply the update. Please try again later."
                  );
                } finally {
                  setIsChecking(false);
                }
              },
            },
            {
              text: "Later",
              style: "cancel",
              onPress: () => setUpdateAvailable(false), // Hide main screen prompt if user chose later
            },
          ]
        );
      } else {
        setUpdateAvailable(false);
        // Optionally, inform the user that no updates are available if manually checked
        // Alert.alert("No Updates", "Your app is up to date.");
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
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        OTA Update Management
      </Text>
      {/* This is the visual confirmation box from the original App.js */}
      <View
        style={{
          marginVertical: 10,
          padding: 15,
          backgroundColor: "#ffeecc",
          borderRadius: 5,
          width: "90%",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "black",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          🎉 This is the NEW OTA Update! 🎉
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
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
          ? "Update available! Check alert prompt."
          : "App is up to date (or no new update found)"}
      </Text>
      {updateError && <Text style={styles.error}>{updateError}</Text>}
      <Button
        title={isChecking ? "Checking..." : "Check for Updates Manually"}
        onPress={checkForUpdate}
        disabled={isChecking}
      />
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Info (expo-updates):</Text>
        <Text style={styles.debugText}>
          Channel: {Updates.channel || "unknown"}
        </Text>
        <Text style={styles.debugText}>
          Runtime Version: {Updates.runtimeVersion || "unknown"}
        </Text>
        <Text style={styles.debugText}>
          Update ID: {Updates.updateId || "none"}
        </Text>
        <Text style={styles.debugText}>
          Created At:{" "}
          {Updates.createdAt
            ? new Date(Updates.createdAt).toLocaleString()
            : "N/A"}
        </Text>
        <Text style={styles.debugText}>
          Is Emulator: {String(Updates.isEmulator)}
        </Text>
        <Text style={styles.debugText}>
          Is Embedded Launch: {String(Updates.isEmbeddedLaunch)}
        </Text>
        <Text style={styles.debugText}>
          Update Available (from hook): {String(updateAvailable)}
        </Text>
        <Text style={styles.debugText}>
          Last Check Result (isAvailable):{" "}
          {debugInfo.isUpdateAvailable !== undefined
            ? String(debugInfo.isUpdateAvailable)
            : "N/A"}
        </Text>
        {debugInfo.errorGettingInfo && (
          <Text style={styles.error}>
            Error getting debug: {debugInfo.errorGettingInfo}
          </Text>
        )}
        {/* <Text style={styles.debugText}>Manifest: {debugInfo.manifest}</Text> */}
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
    padding: 20,
  },
  status: {
    marginVertical: 15,
    color: "#666",
    fontSize: 16,
  },
  error: {
    marginVertical: 10,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  debugContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "90%",
    backgroundColor: "#f9f9f9",
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
});
