import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	SafeAreaView,
	StatusBar,
	Image,
	TouchableOpacity,
	FlatList,
} from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { useUser } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/client";
import Header from "../components/Header";
import { MaterialIcons } from "@expo/vector-icons";

const EmailsScreen = () => {
	const [emails, setEmails] = useState([]);
	const [filter, setFilter] = useState('all'); // Estado para el filtro activo
	const { user } = useUser();
	const navigation = useNavigation();
	const opacity = useSharedValue(0);

	useEffect(() => {
		fetchEmails();
	}, [user, filter]); // Añade 'filter' a las dependencias para refrescar cuando cambie

	const fetchEmails = async () => {
		if (!user?.token) {
			console.error("Token no disponible");
			return;
		}
		try {
			const response = await apiClient.get(
				`/emails?filter=${filter}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);
            console.log("response", response.data);
			opacity.value = 1;
			setEmails(response.data);
		} catch (error) {
			console.error("Error fetching emails:", error);
		}
	};

	const updateEmailStatus = async (emailId, newStatus) => {
		try {
			const response = await apiClient.post(
				`/emails/${emailId}/updateStatus`,
				{
					status: newStatus,
				},
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);
			fetchEmails(); // Refrescar la lista de emails después de actualizar
		} catch (error) {
			console.error("Error updating email status:", error);
		}
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: withSpring(opacity.value),
		};
	});

	const backgroundStyle = "bg-gray-900 dark:bg-slate-900 w-full h-full";

	return (
		<SafeAreaView className={backgroundStyle}>
			<Animated.View style={animatedStyle}>
				<StatusBar barStyle="light-content" />

				<ScrollView
					contentContainerStyle={{
						marginTop: 20,
						marginLeft: 20,
						marginRight: 20,
						paddingBottom: 200,
					}}
				>
					<View className="flex-1">
						{/* Cuatro tarjetas */}
						<View className="flex-row flex-wrap justify-between mt-4 mb-10">
							<TouchableOpacity
								onPress={() => setFilter("answered_by_gemini")}
								style={styles.filterButton}
							>
								<Text style={styles.filterText}>Respondidos por GPT</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => setFilter("to_be_answered")}
								style={styles.filterButton}
							>
								<Text style={styles.filterText}>Pendientes</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => setFilter("all")}
								style={styles.filterButton}
							>
								<Text style={styles.filterText}>Todos</Text>
							</TouchableOpacity>
						</View>
					</View>
					{emails.map((email) => (
						<TouchableOpacity
							style={styles.emailCard}
							onPress={() => navigation.navigate("ReviewEmails", { email })}
							onLongPress={() => updateEmailStatus(email.id, "new_status")}
							key={email.id}
							className="bg-gray-800/70"
						>
							<Text style={styles.emailSubject}>{email.subject}</Text>
							<Text style={styles.emailFrom}>From: {email.from}</Text>
							<Text style={styles.emailBody}>{email.body}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</Animated.View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f0f0f0",
	},
	filterContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 20,
		marginTop: 40, // Agrega un margen superior aquí
	},
	filterButton: {
		padding: 10,
		backgroundColor: "#4caf50",
		borderRadius: 20,
		height: 40,
	},
	filterText: {
		color: "#ffffff",
	},
	emailCard: {
		// backgroundColor: "#141b2b",
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
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 5,
	},
	emailFrom: {
		fontSize: 14,
		color: "#fff",
		marginBottom: 10,
	},
	emailBodyContainer: {
		maxHeight: 100,
	},
	emailBody: {
		fontSize: 14,
		color: "#fff",
	},
});

export default EmailsScreen;
