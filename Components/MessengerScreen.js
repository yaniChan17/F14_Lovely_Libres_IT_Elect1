import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MessengerScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello crush😘",
      sender: "Friend",
      avatar: require("../mypics/husbando.jpg"),
    },
    {
      id: "2",
      image: require("../mypics/lab.jpg"),
      sender: "Friend",
      avatar: require("../mypics/husbando.jpg"),
    },
  ]);
  const [text, setText] = useState("");
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (text.trim() === "") return;
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: "Me",
      avatar: require("../mypics/lable.jpg"),
    };
    setMessages((prev) => [...prev, newMessage]);
    setText("");
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.msgRow,
        item.sender === "Me" ? styles.myRow : styles.friendRow,
      ]}
    >
      {item.sender !== "Me" && <Image source={item.avatar} style={styles.avatar} />}

      <View
        style={[
          styles.msgBubble,
          item.sender === "Me" ? styles.myMsg : styles.friendMsg,
          item.image && styles.photoBubble,
        ]}
      >
        {item.image ? (
          <Image source={item.image} style={styles.msgImage} />
        ) : (
          <Text
            style={[
              styles.msgText,
              item.sender !== "Me" && { color: "black" },
            ]}
          >
            {item.text}
          </Text>
        )}
      </View>

      {item.sender === "Me" && <Image source={item.avatar} style={styles.avatar} />}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={5}
    >
      {/* 🩵 Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Image source={require("../mypics/husbando.jpg")} style={styles.headerAvatar} />
            <View style={styles.activeDot} />
          </View>
          <View>
            <Text style={styles.headerName}>Gojo</Text>
            <Text style={styles.activeText}>Active now</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="call-outline" size={24} color="#1877f2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="videocam-outline" size={24} color="#1877f2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🩵 Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* 🩵 Input */}
      <View style={styles.inputRow}>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  activeDot: {
    width: 10,
    height: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    position: "absolute",
    bottom: 5,
    right: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activeText: {
    fontSize: 12,
    color: "gray",
  },
  headerRight: {
    flexDirection: "row",
    marginRight: 5,
  },
  iconButton: {
    marginLeft: 15,
  },

  
  chatList: {
    paddingHorizontal: 0, 
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 5,
  },
  myRow: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  friendRow: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  msgBubble: {
    padding: 10,
    borderRadius: 15,
    maxWidth: "70%",
  },
  myMsg: {
    backgroundColor: "#1877f2",
  },
  friendMsg: {
    backgroundColor: "#e3e3e3",
  },
  msgText: {
    color: "white",
    fontSize: 16,
  },
  msgImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  photoBubble: {
    backgroundColor: "transparent",
    padding: 0,
  },

  /* Input */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "white",
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#1877f2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});
