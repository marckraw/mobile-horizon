import * as Updates from "expo-updates";
import { Alert } from "react-native";

export const createUpdateService = () => {
  // Private helper function for logging update info
  const logUpdateInfo = () => {
    console.log("Current channel:", Updates.channel);
    console.log("Current runtime version:", Updates.runtimeVersion);
    console.log("Update ID:", Updates.updateId);
    console.log("Is Embedded Launch:", Updates.isEmbeddedLaunch);
    console.log("Created At:", Updates.createdAt);
  };

  // Private helper function for handling update installation
  const handleUpdateInstallation = async () => {
    try {
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
      }
    } catch (error) {
      console.error("Error downloading or applying update:", error);
      Alert.alert(
        "Error",
        "Failed to download or apply the update. Please try again later."
      );
    }
  };

  // Private helper function for showing update alert
  const showUpdateAlert = (update, showNoUpdateAlert = false) => {
    if (update.isAvailable) {
      Alert.alert(
        "Update Available",
        `A new version (${
          update.manifest?.version || "unknown"
        }) is available. Would you like to update now?`,
        [
          {
            text: "Update",
            onPress: handleUpdateInstallation,
          },
          {
            text: "Later",
            style: "cancel",
          },
        ]
      );
    } else if (showNoUpdateAlert) {
      Alert.alert("No Updates", "Your app is up to date.");
    } else {
      console.log("No updates available");
    }
  };

  // Public API
  return {
    checkForUpdatesOnStartup: async () => {
      try {
        console.log("Checking for updates on app startup...");
        logUpdateInfo();

        const update = await Updates.checkForUpdateAsync();
        console.log("Update check result:", update);

        showUpdateAlert(update, false); // Don't show "no update" alert on startup
      } catch (error) {
        console.error("Error checking for updates on startup:", error);
        // Don't show alert for startup errors to avoid bothering users
      }
    },

    checkForUpdatesManually: async () => {
      try {
        console.log("Manual update check initiated...");

        const update = await Updates.checkForUpdateAsync();
        console.log("Manual update check result:", update);

        showUpdateAlert(update, true); // Show "no update" alert for manual checks
      } catch (error) {
        console.error("Error checking for updates manually:", error);
        Alert.alert(
          "Error",
          "Failed to check for updates. Please try again later."
        );
        throw error; // Re-throw for the UI to handle
      }
    },

    getUpdateDebugInfo: async () => {
      try {
        const updateCheckResult = await Updates.checkForUpdateAsync();
        return {
          isEmulator: Updates.isEmulator,
          channel: Updates.channel,
          runtimeVersion: Updates.runtimeVersion,
          updateId: Updates.updateId,
          createdAt: Updates.createdAt
            ? new Date(Updates.createdAt).toLocaleString()
            : "N/A",
          isEmbeddedLaunch: Updates.isEmbeddedLaunch,
          isUpdateAvailable: updateCheckResult.isAvailable,
          manifest: updateCheckResult.manifest
            ? JSON.stringify(updateCheckResult.manifest, null, 2)
            : "N/A",
        };
      } catch (error) {
        console.error("Error getting debug info:", error);
        return { errorGettingInfo: error.message };
      }
    },
  };
};

// Create and export the service instance
export const updateService = createUpdateService();
