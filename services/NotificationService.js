import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { isDevice } from 'expo-device';

async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    if (isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({
            experienceId: '@davidbadell/AttentionApp',
            projectId: '1dde657c-8cd9-435b-947f-021f6c15dbb7'
        })).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

export { registerForPushNotificationsAsync };
