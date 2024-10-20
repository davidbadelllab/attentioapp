import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MessagingScreen from '../screens/MessagingScreen';
import EmailsScreen from '../screens/EmailsScreen';
import WatchCheck from '../screens/WatchCheck';  // Importa el componente WatchCheck
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Calendar':
              iconName = 'calendar-outline';
              break;
            case 'Messaging':
              iconName = 'chatbubble-outline';
              break;
            case 'Emails':
              iconName = 'mail-outline';
              break;
            case 'WatchCheck':  // Icono para la pestaña del Reloj Control
              iconName = 'watch-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00adf5',
        tabBarInactiveTintColor: 'gray',
        tabBarBackground: () => (
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={{ flex: 1 }}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Messaging" component={MessagingScreen} />
      <Tab.Screen name="Emails" component={EmailsScreen} options={{ title: 'Emails' }} />
      <Tab.Screen name="WatchCheck" component={WatchCheck} options={{ title: 'Reloj Control' }} />
    </Tab.Navigator>
  );
}
