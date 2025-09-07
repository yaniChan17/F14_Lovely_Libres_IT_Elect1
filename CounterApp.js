import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'


export default function CounterApp (){
    const [count, setCount] = useState(0);

    return(
        <View style = {StyleSheet.container}>
            <Text style = {styles.title}>CounterApp</Text>
             <Text style = {styles.counter}>{count}</Text>
             <Button title='Increment'onPress={() => setCount(count + 1)}></Button>
               <Button title='Decrement'onPress={() => setCount(count - 1)}></Button>
        </View>
    )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{ fontSize: 24, fontWeight: 'bold', marginBottom: 10}, counter:{fontSize: 40, margin: 20}
});