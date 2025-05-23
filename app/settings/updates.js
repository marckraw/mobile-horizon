import { StatusBar } from "expo-status-bar";
import { Text, View, Button } from "react-native";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { updateService } from "../../src/services/updateService";

export default function UpdatesScreen() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Only get debug info when screen loads, no automatic checking
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    const info = await updateService.getUpdateDebugInfo();
    setDebugInfo(info);
    if (info.isUpdateAvailable !== undefined) {
      setUpdateAvailable(info.isUpdateAvailable);
    }
  };

  const handleManualCheck = async () => {
    try {
      setIsChecking(true);
      setUpdateError(null);
      await updateService.checkForUpdatesManually();
      // Refresh debug info after manual check
      await loadDebugInfo();
    } catch (error) {
      setUpdateError(error.message || "Failed to check for updates");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center p-5">
      <Text className="text-lg font-bold mb-2.5">OTA Update Management</Text>
      <Text className="text-sm text-gray-600 text-center mb-4 px-4">
        Updates are checked automatically when the app starts. Use this screen
        to view debug information and manually check for updates.
      </Text>
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
      <Text className="my-4 text-gray-600 text-base text-center">
        {isChecking
          ? "Checking for updates..."
          : updateAvailable
          ? "Update available! Check alert prompt."
          : "No pending updates found"}
      </Text>
      {updateError && (
        <Text className="my-2.5 text-red-500 text-center px-5">
          {updateError}
        </Text>
      )}
      <Button
        title={isChecking ? "Checking..." : "Check for Updates Manually"}
        onPress={handleManualCheck}
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
          Update Available (from check): {String(updateAvailable)}
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
