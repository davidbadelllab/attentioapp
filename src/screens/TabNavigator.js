// TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import MessagingScreen from './src/screens/MessagingScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = 'home'; break;
            case 'Profile': iconName = 'person'; break;
            case 'Calendar': iconName = 'event'; break;
            case 'Messaging': iconName = 'message'; break;
            default: iconName = 'home';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Messaging" component={MessagingScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
