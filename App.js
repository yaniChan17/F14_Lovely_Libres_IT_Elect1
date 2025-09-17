import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import your two screens
import MessengerScreen from "./MessengerScreen";
import CommentScreen from "./CommentScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen name="Messenger" component={MessengerScreen} />
        <Tab.Screen name="Comments" component={CommentScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
