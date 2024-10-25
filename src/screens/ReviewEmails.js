import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
} from "react-native";
import { useUser } from "../context/UserContext";
import { Ionicons } from "@expo/vector-icons"; // Usamos Ionicons para íconos elegantes
import apiClient from "../api/client";
const ReviewEmails = ({ route, navigation }) => {
	const { email } = route.params;
	const [response, setResponse] = useState("");
	const { user } = useUser();

	const handleResponse = async () => {
		if (!response.trim()) {
			alert("Por favor, escriba una respuesta antes de enviar.");
			return;
		}
		try {
			const responsePayload = {
				from: user.email,
				to: email.from,
				subject: `RE: ${email.subject}`,
				body: response,
			};

            const response = await apiClient.post("/emails/send", { responsePayload },{
				headers: {
					Authorization: `Bearer ${user.token}`,
				}
			});

			if (response.data) {
				alert("Respuesta enviada con éxito.");
				setResponse("");
				navigation.goBack();
			}
		} catch (error) {
			console.error("Error al enviar la respuesta:", error);
			alert("Error al enviar la respuesta.");
		}
	};

	return (
		<KeyboardAvoidingView behavior="padding" style={styles.container}>
			<ScrollView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Detalles del Email</Text>
					<TouchableOpacity
						style={styles.closeButton}
						onPress={() => navigation.goBack()}
					>
						<Ionicons name="close" size={30} color="black" />
					</TouchableOpacity>
				</View>
				<Text style={styles.label}>De: {email.from}</Text>
				<Text style={styles.label}>Asunto: {email.subject}</Text>
				<Text style={styles.label}>Contenido:</Text>
				<Text style={styles.emailContent}>{email.body}</Text>

				{email.respuestaIA && (
					<>
						<Text style={styles.label}>Respuesta GPT</Text>
						<Text style={styles.emailContent}>{email.respuestaIA}</Text>
					</>
				)}

				<Text style={styles.label}>Responder</Text>
				<TextInput
					style={styles.input}
					multiline
					placeholder="Escribe tu respuesta..."
					value={response}
					onChangeText={setResponse}
				/>
				<TouchableOpacity style={styles.sendButton} onPress={handleResponse}>
					<Text style={styles.sendButtonText}>Enviar Respuesta</Text>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#141b2b",
		// backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#fff",
	},
	closeButton: {
		padding: 10,
	},
	label: {
		fontWeight: "500",
		fontSize: 16,
		marginHorizontal: 20,
		marginTop: 10,
		color: "#fff",
	},
	emailContent: {
		fontSize: 16,
		color: "#666",
		padding: 20,
		backgroundColor: "#f9f9f9",
		borderRadius: 10,
		margin: 20,
	},
	input: {
		height: 150,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 10,
		padding: 15,
		marginHorizontal: 20,
		marginBottom: 20,
		backgroundColor: "#ffffff",
		textAlignVertical: "top",
		fontSize: 16,
	},
	sendButton: {
		backgroundColor: "#4caf50",
		borderRadius: 10,
		paddingVertical: 15,
		paddingHorizontal: 20,
		alignItems: "center",
		marginHorizontal: 20,
		marginBottom: 30,
	},
	sendButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "500",
	},
});

export default ReviewEmails;
