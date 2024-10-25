import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';
import { registerForPushNotificationsAsync } from './services/NotificationService';
import { handleNewMessagesNotification } from './services/CountMessaging';


import HomeTabs from './src/navigation/HomeTabs';
import LoginScreen from './src/screens/LoginScreen';
import ReviewEmails from './src/screens/ReviewEmails';
import WatchCheck from './src/screens/WatchCheck';  // Importación de la vista WatchCheck
import ActiveMessaging from './src/screens/ActiveMessaging';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Registra para obtener el token de notificaciones y luego verifica nuevos mensajes
    registerForPushNotificationsAsync().then(token => {
      console.log("Token de notificaciones:", token);
      if (token) {
        handleNewMessagesNotification(token);
      }
    });
  }, []);

  return (
			<UserProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Login">
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="HomeTabs"
							component={HomeTabs}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="ReviewEmails"
							component={ReviewEmails}
							options={{
								title: "Revisar Emails",
								headerStyle: {
									backgroundColor: "#141b2b",
								},
								headerTintColor: "#fff",
							}}
						/>
						<Stack.Screen
							name="ActiveMessaging"
							component={ActiveMessaging}
							options={{
								tabBarVisible: false,
								title: "Mensajes",
								headerStyle: {
									backgroundColor: "#141b2b",
								},
								headerTintColor: "#fff",
							}}
						/>
						<Stack.Screen
							name="WatchCheck"
							component={WatchCheck}
							options={{ title: "Reloj Control" }} // Añade opciones de cabecera si son necesarias
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</UserProvider>
		);
}
