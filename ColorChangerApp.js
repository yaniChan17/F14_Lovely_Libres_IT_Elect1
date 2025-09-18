import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function ColorChangerApp() {
  const [bgColor, setBgColor] = useState('white');

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>Color Changer</Text>
      <View style={styles.buttons}>
        <Button title="White" onPress={() => setBgColor('white')} />
        <Button title="Light Blue" onPress={() => setBgColor('lightblue')} />
        <Button title="Light Green" onPress={() => setBgColor('lightgreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttons: {
    width: '70%',
    gap: 10,
  },
});

