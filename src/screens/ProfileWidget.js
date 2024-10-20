import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '../context/UserContext';

const ProfileWidget = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <View style={styles.profileContainer}>
      <TouchableOpacity style={styles.profileButton}>
        <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{user.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    position: 'absolute',
    top: 10, // Adjust the position according to your layout
    right: 10,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  profileName: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProfileWidget;
