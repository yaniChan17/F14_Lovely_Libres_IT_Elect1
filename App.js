import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView} from 'react-native';

import React, {useState} from 'react';
import CounterApp from './CounterApp';
import ColorChangerApp from './ColorChangerApp';

export default function App() {
  
   
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style= {styles.section}>
      <CounterApp/>
      </View>
      <View style ={styles.section}>
        <ColorChangerApp />
      </View>
    </ScrollView>
  );
} 

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20
  },
  section:{
    marginBottom:40
  }
});
