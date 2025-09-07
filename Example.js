import react, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Example(){
    const [ comment, setComment] = useState("");

    return(
        <View>
            <TextInput placeholder="isuwat bitch" onChange={(text)=> setComment(text)}>


            </TextInput>


        </View>
    )
}