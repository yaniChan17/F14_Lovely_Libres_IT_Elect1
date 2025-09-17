import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";

export default function CommentScreen() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const postComment = () => {
    if (text.trim() === "") return;
    setComments([...comments, { id: Date.now().toString(), text }]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.post}>📌 Post: "React Native is awesome!"</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.comment}>💬 {item.text}</Text>}
      />
      
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.button} onPress={postComment}>
          <Text style={styles.btnText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  post: { marginBottom: 10, fontWeight: "600" },
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
  comment: { padding: 5, backgroundColor: "#f0f0f0", borderRadius: 8, marginVertical: 2 },
});
