import React, { useState } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'


export default function ColorChangerApp(){
    const [bgColor, setBgColor] = useState('white');

    return(
        <View style = {[styles.container, {backgroundColor:bgColor}]}>
             <Button title='White'onPress={() => setBgColor('white')}/>
               <Button title='Light Blue'onPress={() => setBgColor('lightblue')}/>
               <Button title='Light Green'onPress={() => setBgColor('lightgreen')}/>
        </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});