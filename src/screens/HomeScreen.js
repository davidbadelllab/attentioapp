import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';


const ProfileWidget = () => {
  const { user } = useUser();
  return (
    <View style={styles.profileWidget}>
      <Image source={{ uri: user?.profilePicture || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
      <Text style={styles.profileName}>{user?.name || 'Username'}</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Obtener el token del contexto del usuario

  const opacity = useSharedValue(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user || !user.token) {
        console.log("No user token available.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://attention.cl/api/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setMetrics(response.data);
        opacity.value = 1;  // Start animation when data is loaded
      } catch (err) {
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(opacity.value),
    };
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          <View style={styles.card}>
            <MaterialIcons name="email" size={50} color="#007BFF" />
            <Text style={styles.metricTitle}>Total Emails</Text>
            <Text style={styles.metricValue}>{metrics.totalEmails}</Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons name="android" size={50} color="#4CAF50" />
            <Text style={styles.metricTitle}>GPT Responses</Text>
            <Text style={styles.metricValue}>{metrics.emailsRespondedByGemini}</Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons name="pie-chart" size={50} color="#FF9800" />
            <Text style={styles.metricTitle}>GPT %</Text>
            <Text style={styles.metricValue}>{metrics.percentageRespondedByGemini.toFixed(2)}%</Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons name="people" size={50} color="#9C27B0" />
            <Text style={styles.metricTitle}>Human Responses</Text>
            <Text style={styles.metricValue}>{metrics.emailsRespondedByHuman}</Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons name="bar-chart" size={50} color="#3F51B5" />
            <Text style={styles.metricTitle}>Human %</Text>
            <Text style={styles.metricValue}>{metrics.percentageRespondedByHuman.toFixed(2)}%</Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons name="public" size={50} color="#F44336" />
            <Text style={styles.metricTitle}>Country</Text>
            <Text style={styles.metricValue}>{metrics.country}</Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons name="location-on" size={50} color="#009688" />
            <Text style={styles.metricTitle}>IP</Text>
            <Text style={styles.metricValue}>{metrics.ip}</Text>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:75,
  },
  scrollContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  profileWidget: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '40%',
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 5,
  },
});

export default HomeScreen;
