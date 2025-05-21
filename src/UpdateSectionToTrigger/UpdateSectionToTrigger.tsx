import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Updates from "expo-updates";

interface DebugInfo {
  isEmulator: boolean;
  channel: string | null;
  runtimeVersion: string | null;
  updateId: string | null;
  createdAt: Date | null;
  isEmbeddedLaunch: boolean;
  checkResult: Updates.UpdateCheckResult;
}

interface UpdateSectionToTriggerProps {
  checkForUpdate: () => Promise<void>;
  isChecking: boolean;
  debugInfo: DebugInfo;
}

export const UpdateSectionToTrigger: React.FC<UpdateSectionToTriggerProps> = ({
  checkForUpdate,
  isChecking,
  debugInfo,
}) => {
  return (
    <View>
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
};

const styles = StyleSheet.create({
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
