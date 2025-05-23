import { StatusBar } from "expo-status-bar";
import { Text, View, Button, Alert } from "react-native";
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
    <View className="flex-1 bg-white items-center justify-center p-5">
      <Text className="text-lg font-bold mb-2.5">OTA Update Management</Text>
      {/* This is the visual confirmation box from the original App.js */}
      <View className="my-2.5 p-4 bg-yellow-100 rounded w-[90%]">
        <Text className="text-lg text-black text-center font-bold">
          🎉 This is the NEW OTA Update! 🎉
        </Text>
        <Text className="mt-2 text-sm text-gray-500 text-center">
          If you see this box, OTA updates are working!
        </Text>
      </View>
      <StatusBar style="auto" />
      <Text className="my-4 text-gray-600 text-base">
        {isChecking
          ? "Checking for updates..."
          : updateAvailable
          ? "Update available! Check alert prompt."
          : "App is up to date (or no new update found)"}
      </Text>
      {updateError && (
        <Text className="my-2.5 text-red-500 text-center px-5">
          {updateError}
        </Text>
      )}
      <Button
        title={isChecking ? "Checking..." : "Check for Updates Manually"}
        onPress={checkForUpdate}
        disabled={isChecking}
      />
      <View className="mt-5 p-4 border border-gray-300 rounded-lg w-[90%] bg-gray-50">
        <Text className="text-base font-bold mb-2.5">
          Debug Info (expo-updates):
        </Text>
        <Text className="text-xs text-gray-800 mb-1 font-mono">
          Channel: {Updates.channel || "unknown"}
        </Text>
        <Text className="text-xs text-gray-800 mb-1 font-mono">
          Runtime Version: {Updates.runtimeVersion || "unknown"}
        </Text>
        <Text className="text-xs text-gray-800 mb-1 font-mono">
          Update ID: {Updates.updateId || "none"}
        </Text>
        <Text className="text-xs text-gray-800 mb-1 font-mono">
          Created At:{" "}
          {Updates.createdAt
            ? new Date(Updates.createdAt).toLocaleString()
            : "N/A"}
        </Text>
        <Text className="text-xs text-gray-800 mb-1 font-mono">
          Is Emulator: {String(Updates.isEmulator)}
        </Text>
        <Text className="text-xs text-gray-800 mb-1 font-mono">
          Is Embedded Launch: {String(Updates.isEmbeddedLaunch)}
        </Text>
        <Text className="text-xs text-gray-800 mb-1 font-mono">
          Update Available (from hook): {String(updateAvailable)}
        </Text>
        <Text className="text-xs text-gray-800 mb-1 font-mono">
          Last Check Result (isAvailable):{" "}
          {debugInfo.isUpdateAvailable !== undefined
            ? String(debugInfo.isUpdateAvailable)
            : "N/A"}
        </Text>
        {debugInfo.errorGettingInfo && (
          <Text className="my-2.5 text-red-500 text-center px-5">
            Error getting debug: {debugInfo.errorGettingInfo}
          </Text>
        )}
        {/* <Text className="text-xs text-gray-800 mb-1 font-mono">Manifest: {debugInfo.manifest}</Text> */}
      </View>
    </View>
  );
}
