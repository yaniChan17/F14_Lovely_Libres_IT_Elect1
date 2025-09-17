import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function MessengerScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello!", sender: "Friend" },
  ]);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (text.trim() === "") return;
    setMessages([...messages, { id: Date.now().toString(), text, sender: "Me" }]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msgBubble,
              item.sender === "Me" ? styles.myMsg : styles.friendMsg,
            ]}
          >
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.btnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f9f9f9" },
  row: { flexDirection: "row", marginTop: 10 },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#1877f2",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 20,
  },
  btnText: { color: "white", fontWeight: "bold" },
  msgBubble: { padding: 10, borderRadius: 15, marginVertical: 5, maxWidth: "70%" },
  myMsg: { backgroundColor: "#1877f2", alignSelf: "flex-end" },
  friendMsg: { backgroundColor: "#e3e3e3", alignSelf: "flex-start" },
  msgText: { color: "white" },
});
