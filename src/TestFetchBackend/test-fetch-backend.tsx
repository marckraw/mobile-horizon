import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { apiService } from "../services/api.service";
import { apiConfig } from "../config";

export const TestFetchBackend: React.FC = () => {
  const handlePress = async (): Promise<void> => {
    console.log(apiConfig.baseUrl);
    const response = await apiService.getAllSignals();
    alert(JSON.stringify(response.data));
  };

  return (
    <View style={styles.container}>
      <Text>Test Fetch Backend</Text>
      <Button title="Fetch from db" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    // padding: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 5,
  },
});
