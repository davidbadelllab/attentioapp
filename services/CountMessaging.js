import * as Notifications from 'expo-notifications';
import { useUser } from '../src/context/UserContext'; // Ajustamos la ruta si es necesario


export async function handleNewMessagesNotification() {
    const { user } = useUser();  // Obtenemos el token del contexto

    if (!user?.token) {
        console.error("Token no disponible en el contexto");
        return;
    }

    try {
        const response = await fetch('https://attention.cl/api/messages/unread', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user.token}`,  // Usamos el token del contexto aquí
                'Content-Type': 'application/json',
            },
        });

        // Verificar si la respuesta es HTML en lugar de JSON
        const responseText = await response.text(); // Obtener el texto completo de la respuesta para depurar
        console.log("Respuesta del servidor:", responseText);

        // Intentar parsear como JSON
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Error al parsear JSON:", jsonError);
            return;
        }

        // Verificar si la respuesta contiene el campo "cantidad"
        const { cantidad } = parsedResponse;
        if (cantidad > 0) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Tienes nuevos mensajes!",
                    body: `Tienes ${cantidad} mensajes sin leer.`,
                },
                trigger: null, // inmediatamente
            });
        }
    } catch (error) {
        console.error("Error al obtener mensajes no leídos:", error);
    }
}
