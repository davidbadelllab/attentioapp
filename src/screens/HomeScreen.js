import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	SafeAreaView,
	StatusBar,
	Image,
	Dimensions
} from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { useUser } from "../context/UserContext";
import apiClient from "../api/client";
import Header from "../components/Header";
import { ProgressChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
console.log(screenWidth);
const chartConfig = {
	backgroundGradientFrom: "#0B192C",
	backgroundGradientTo: "#0B192C",
	color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
	labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
	strokeWidth: 2,
	barPercentage: 0.5,
};

const HomeScreen = () => {
	const [metrics, setMetrics] = useState(null);
	const [loading, setLoading] = useState(true);
	const { user } = useUser(); // Obtener el token del contexto del usuario

	const opacity = useSharedValue(0);

	const fetchMetrics = async () => {
		console.log("user", user);

		if (!user || !user.token) {
			console.log("No user token available.");
			setLoading(false);
			return;
		}
		try {
			const response = await apiClient.get("/dashboard", {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			setMetrics(response.data);
			opacity.value = 1; // Start animation when data is loaded
		} catch (err) {
			console.error("Error fetching metrics:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMetrics();
	}, []);

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

	if (!metrics) {
		return <Text style={styles.noData}>No data available</Text>;
	}

	const progressData = {
		labels: ["GPT %"], // Solo un dato para el progreso de GPT
		data: [metrics.percentageRespondedByGemini / 100],
	};

	const lineData = {
		labels: ["Human %", "GPT %"], // Representación de ambos porcentajes en la misma línea
		datasets: [
			{
				data: [
					metrics.percentageRespondedByHuman,
					metrics.percentageRespondedByGemini,
				],
				color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Color ajustado si es necesario
				strokeWidth: 2,
			},
		],
		legend: ["Response Rate"],
	};

	// bg-gray-900

	// for view card bg-gray-800/70
	const backgroundStyle = "bg-gray-900 dark:bg-slate-900 w-full h-full";

	return (
		<SafeAreaView className={backgroundStyle}>
			<Animated.View style={animatedStyle}>
				<StatusBar barStyle="light-content" />
				<View className="flex-1">
					{/* Header */}
					<Header />

					{/* Cuatro tarjetas */}
					<View className="flex-row flex-wrap justify-center mt-4">
						<View className="w-92 h-80 bg-gray-800/70 mx-2 mb-2 rounded-lg justify-center items-center">
							<ProgressChart
								data={progressData}
								width={screenWidth - 100}
								height={228} // Aumentar altura para espacio
								strokeWidth={25} // Aumentar grosor de la barra para reducir espacio interno
								radius={60} // Mantener un radio más grande para que el círculo exterior crezca
								chartConfig={{
									...chartConfig,
									color: (opacity = 1) => `rgba(173, 73, 225, ${opacity})`,
								}}
								hideLegend={true}
							/>
							<Text style={[styles.metricValueInside, { marginTop: 0 }]}>
								{metrics.percentageRespondedByGemini.toFixed(2)}%
							</Text>
						</View>
						<View className="w-92 h-80 bg-gray-800/70 mx-2 mb-2 rounded-lg justify-center items-center">
							<LineChart
								data={lineData}
								width={screenWidth - 100}
								height={270}
								verticalLabelRotation={30}
								chartConfig={chartConfig}
								bezier
							/>
						</View>

						{/* <View className="w-44 h-44 bg-gray-800/70 mx-2 mb-2 rounded-lg justify-center items-center">
							<MaterialIcons name="insights" size={70} color="gray" />

							<Text className="text-gray-600/70 text-center font-bold text-lg">
								GPT
							</Text>
							<Text className="text-gray-600/70 text-center font-bold text-2xl">
								{metrics.percentageRespondedByGemini.toFixed(2)}%
							</Text>
						</View>
						<View className="w-44 h-44 bg-gray-800/70 mx-2 mb-2 rounded-lg justify-center items-center">
							<MaterialIcons name="assistant" size={70} color="gray" />

							<Text className="text-gray-600/70 text-center font-bold text-lg">
								GPT Responses
							</Text>
							<Text className="text-gray-600/70 text-center font-bold text-2xl">
								{metrics.emailsRespondedByGemini}
							</Text>
						</View>
						<View className="w-44 h-44 bg-gray-800/70 mx-2 mb-2 rounded-lg justify-center items-center">
							<MaterialIcons name="people" size={70} color="gray" />

							<Text className="text-gray-600/70 text-center font-bold text-lg">
								Human
							</Text>
							<Text className="text-gray-600/70 text-center font-bold text-2xl">
								{metrics.percentageRespondedByHuman.toFixed(2)}%
							</Text>
						</View>

						<View className="w-44 h-44 bg-gray-800/70 mx-2 mb-2 rounded-lg justify-center items-center">
							<MaterialIcons name="keyboard" size={70} color="gray" />

							<Text className="text-gray-600/70 text-center font-bold text-lg">
								Human Responses
							</Text>
							<Text className="text-gray-600/70 text-center font-bold text-2xl">
								{metrics.emailsRespondedByHuman}
							</Text>
						</View>
						<View className="w-44 h-44 bg-gray-800/70 mx-2 mb-2 rounded-lg justify-center items-center">
							<MaterialIcons name="email" size={70} color="gray" />

							<Text className="text-gray-600/70 text-center font-bold text-lg">
								Total Emails
							</Text>
							<Text className="text-gray-600/70 text-center font-bold text-2xl">
								{metrics?.totalEmails}
							</Text>
						</View> */}
					</View>
				</View>
			</Animated.View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#F7F9FC",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 75,
	},
	scrollContent: {
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
		textAlign: "center",
		textTransform: "uppercase",
	},
	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
	},
	profileWidget: {
		position: "absolute",
		top: 10,
		right: 20,
		backgroundColor: "#ffffff",
		padding: 10,
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 6,
		flexDirection: "row",
		alignItems: "center",
	},
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},
	profileName: {
		fontWeight: "bold",
		color: "#333",
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		padding: 20,
		width: "40%",
		marginBottom: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 10,
	},
	metricValueInside: {
		fontSize: 16,
		color: "#AD49E1",
		fontWeight: "bold",
		marginTop: 10,
		textAlign: "center",
	},
	metricTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginTop: 10,
		color: "#555",
		textAlign: "center",
	},
	metricValue: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#666",
		marginTop: 5,
	},
});

export default HomeScreen;
