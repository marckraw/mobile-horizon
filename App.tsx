import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Alert, StyleSheet } from "react-native";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { UpdateSectionToTrigger } from "./src/UpdateSectionToTrigger/UpdateSectionToTrigger";
import { TestFetchBackend } from "./src/TestFetchBackend/test-fetch-backend";

interface DebugInfo {
  isEmulator: boolean;
  channel: string | null;
  runtimeVersion: string | null;
  updateId: string | null;
  createdAt: Date | null;
  isEmbeddedLaunch: boolean;
  checkResult: Updates.UpdateCheckResult;
}

export default function App(): JSX.Element {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({} as DebugInfo);

  useEffect(() => {
    checkForUpdate();
    getDebugInfo();
  }, []);

  async function getDebugInfo(): Promise<void> {
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

  async function checkForUpdate(): Promise<void> {
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
                    "Failed to download the update: " + (error as Error).message
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
      setUpdateError(
        "Failed to check for updates: " + (error as Error).message
      );
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
      <View>
        <Text>Hello</Text>
      </View>
      <TestFetchBackend />
      <View
        style={{ marginVertical: 30, padding: 20, backgroundColor: "#ffeecc" }}
      >
        <Text style={{ fontSize: 22, color: "black", textAlign: "center" }}>
          🎉 This is the NEW OTA Update! TAK KURWA! 🎉
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
      <UpdateSectionToTrigger
        checkForUpdate={checkForUpdate}
        isChecking={isChecking}
        debugInfo={debugInfo}
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
  error: {
    marginVertical: 10,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
