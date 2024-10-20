import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert, Image } from "react-native";
import axios from "axios";
import { useUser } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker'; // Importar ImagePicker de Expo
import EmojiSelector from 'react-native-emoji-selector'; // Librería para el selector de emojis

const ActiveMessaging = ({ contact, onBack }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Estado para mostrar el selector de emojis
  const [image, setImage] = useState(null); // Estado para almacenar la imagen seleccionada

  // Obtener los mensajes del contacto seleccionado
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.post("https://attention.cl/api/messages/fetch", {
        id: contact.id,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.data.messages) {
        setMessages(response.data.messages);
      } else {
        console.log("No se encontraron mensajes.");
      }
    } catch (error) {
      console.error("Error al recuperar mensajes:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "No se pudieron cargar los mensajes");
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && !image) return; // No enviar si no hay texto ni imagen

    try {
      const messageData = {
        id: contact.id,
        message: newMessage,
        temporaryMsgId: Date.now().toString(),
      };

      if (image) {
        const formData = new FormData();
        formData.append("file", {
          uri: image,
          name: "photo.jpg",
          type: "image/jpeg"
        });
        messageData.image = formData;
      }

      const response = await axios.post("https://attention.cl/api/messages/send", messageData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessages([...messages, response.data.message_data]);
      setNewMessage("");
      setImage(null); // Limpiar la imagen seleccionada
    } catch (error) {
      console.error("Error enviando el mensaje:", error.response ? error.response.data : error.message);
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={item.from_id === user.id ? styles.sentMessage : styles.receivedMessage}>
      {item.body && <Text style={styles.messageText}>{item.body}</Text>}
      {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
    </View>
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"<"} Volver a contactos</Text>
      </TouchableOpacity>

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
      />

      {showEmojiPicker && (
        <EmojiSelector
          onEmojiSelected={(emoji) => setNewMessage(newMessage + emoji)}
          showSearchBar={false}
          showTabs={true}
          showSectionTitles={false}
          columns={8} // No utilizamos categorías específicas
        />
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.emojiButton} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Text style={styles.emojiButtonText}>😀</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.messageInput}
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.previewImageContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImageButton}>
            <Text style={styles.removeImageButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Estilos previos
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  backButton: {
    padding: 15,
    backgroundColor: "#00adf5",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#d1f1d5",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#b2f5ea",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  messageInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#00adf5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  emojiButton: {
    marginRight: 5,
  },
  emojiButtonText: {
    fontSize: 24,
  },
  imageButton: {
    marginRight: 5,
  },
  imageButtonText: {
    fontSize: 24,
  },
  previewImageContainer: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    alignItems: "center",
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 20,
    padding: 5,
  },
  removeImageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ActiveMessaging;
