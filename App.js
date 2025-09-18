import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import CounterApp from './CounterApp';
import ColorChangerApp from './ColorChangerApp';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <CounterApp />
      </View>
      <View style={styles.section}>
        <ColorChangerApp />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    padding: 20,
  },
  section: {
    marginBottom: 40,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
