import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Alert, Animated } from "react-native";
import axios from 'axios';
import ActiveMessaging from './ActiveMessaging';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons'; // Iconos de Expo

const MessagingScreen = () => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animación de fade-in

  useEffect(() => {
    if (user && user.token) {
      fetchContacts();
    } else {
      Alert.alert("Error", "El usuario no está autenticado");
    }
  }, [user]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("https://attention.cl/api/contacts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const filteredContacts = response.data.contacts.filter(contact => contact.id !== user.id);
      setContacts(filteredContacts);
    } catch (error) {
      console.error("Error al recuperar contactos:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "No se pudieron cargar los contactos");
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {!selectedContact ? (
        <View style={styles.contactListContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder="Buscar contacto..."
              value={search}
              onChangeText={(text) => setSearch(text)}
            />
          </View>
          <FlatList
            data={contacts.filter((contact) =>
              contact.name.toLowerCase().includes(search.toLowerCase())
            )}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleContactSelect(item)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.profile_photo_url }}
                  style={styles.contactAvatar}
                />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactText}>{item.name}</Text>
                  {item.unread_messages > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{item.unread_messages}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No hay contactos disponibles.</Text>
            }
          />
        </View>
      ) : (
        <ActiveMessaging contact={selectedContact} onBack={() => setSelectedContact(null)} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fc",
    paddingTop: 10,
    marginTop:40,
  },
  contactListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderColor: "#00adf5",
    borderWidth: 2,
  },
  contactInfo: {
    flexDirection: "column",
    flex: 1,
  },
  contactText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default MessagingScreen;
