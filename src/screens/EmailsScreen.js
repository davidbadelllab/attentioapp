import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

const EmailsScreen = () => {
    const [emails, setEmails] = useState([]);
    const [filter, setFilter] = useState(null); // Estado para el filtro activo
    const { user } = useUser();
    const navigation = useNavigation();

    useEffect(() => {
        fetchEmails();
    }, [user, filter]); // Añade 'filter' a las dependencias para refrescar cuando cambie

    const fetchEmails = async () => {
        if (!user?.token) {
            console.error("Token no disponible");
            return;
        }
        try {
            const url = `https://attention.cl/api/emails${filter ? `?filter=${filter}` : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setEmails(data);
        } catch (error) {
            console.error('Error fetching emails:', error);
        }
    };

    const updateEmailStatus = async (emailId, newStatus) => {
        try {
            const response = await fetch(`https://attention.cl/api/emails/${emailId}/updateStatus`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();
            fetchEmails(); // Refrescar la lista de emails después de actualizar
        } catch (error) {
            console.error('Error updating email status:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setFilter('answered_by_gemini')} style={styles.filterButton}>
                    <Text style={styles.filterText}>Respondidos por GPT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('to_be_answered')} style={styles.filterButton}>
                    <Text style={styles.filterText}>Pendientes por respuesta</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter(null)} style={styles.filterButton}>
                    <Text style={styles.filterText}>Todos</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={emails}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.emailCard}
                        onPress={() => navigation.navigate('ReviewEmails', { email: item })}
                        onLongPress={() => updateEmailStatus(item.id, 'new_status')}
                    >
                        <Text style={styles.emailSubject}>{item.subject}</Text>
                        <Text style={styles.emailFrom}>From: {item.from}</Text>
                        <ScrollView style={styles.emailBodyContainer}>
                            <Text style={styles.emailBody}>{item.body}</Text>
                        </ScrollView>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 40, // Agrega un margen superior aquí
    },
    filterButton: {
        padding: 10,
        backgroundColor: '#4caf50',
        borderRadius: 20,
    },
    filterText: {
        color: '#ffffff',
    },
    emailCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    emailSubject: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    emailFrom: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    emailBodyContainer: {
        maxHeight: 100,
    },
    emailBody: {
        fontSize: 14,
        color: '#333',
    },
});

export default EmailsScreen;
