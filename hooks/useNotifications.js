import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../services/NotificationService';

function useNotifications() {
    useEffect(() => {
        registerForPushNotificationsAsync();

        // Si necesitas manejar las notificaciones cuando la app está abierta:
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        return () => subscription.remove();
    }, []);

    return;
}

export default useNotifications;
