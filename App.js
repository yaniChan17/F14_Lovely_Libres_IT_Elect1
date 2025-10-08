import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import MessengerScreen from "./Components/MessengerScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <MessengerScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
