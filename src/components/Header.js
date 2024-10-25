import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";

const Header = () => {
	const { user, setUser } = useUser();
	const navigation = useNavigation();
	
	const handleLogout = () => {
		setUser(null);
		navigation.navigate("Login");
	};

	return (
		<View className="h-16 mx-3 mt-3 bg-gray-800/70 rounded-lg">
			<View className="flex-row justify-between items-center px-3 py-2">
				<Image
					source={{
						uri: user?.avatar || "https://via.placeholder.com/150",
					}}
					style={styles.profileImage}
				/>
				<Text className="text-gray-600/90 ml-1 uppercase font-bold">
					{"Hola 👋🏻, "} {user?.name || "Username"}
				</Text>
				<TouchableOpacity onPress={handleLogout}>
					<MaterialIcons
						name="logout"
						size={24}
						color="gray"
						className="justify-end"
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}


const styles = StyleSheet.create({
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
});

export default Header;
