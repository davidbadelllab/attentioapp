import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setSuccess(false);
    setError(false);

    try {
      const response = await axios.post("https://attention.cl/api/login", {
        email,
        password,
      });

      if (response.data.token) {
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate("Home");
          //navigation.replace("Home");
        }, 2000);
      } else {
        setError(true);
        Alert.alert("Error", "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error.response.data);
      setError(true);
      Alert.alert("Error", "Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animación en la parte superior izquierda */}
      <LottieView
        source={require("../../assets/Animation - 1729020863881.json")} 
        autoPlay
        loop
        style={styles.lottieTopLeft}
      />
      {/* Animación en la parte inferior derecha */}
      <LottieView
        source={require("../../assets/Animation - 1729020725065.json")}
        autoPlay
        loop
        style={styles.lottieBottomRight}
      />

      <Image
        source={require("../../assets/logoDark.png")}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => Alert.alert("Ir a registro")}
        style={styles.link}
      >
        <Text style={styles.linkText}>
          ¿No tienes una cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>

      {loading && (
        <LottieView
          source={require("../../assets/loading.json")}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      )}

      {success && (
        <View style={styles.animationOverlay}>
          <LottieView
            source={require("../../assets/acepted.json")}
            autoPlay
            loop={false}
            style={styles.animation}
            onAnimationFinish={() => {
              setSuccess(false);
            }}
          />
        </View>
      )}

      {error && (
        <View style={styles.animationOverlay}>
          <LottieView
            source={require("../../assets/error.json")}
            autoPlay
            loop={false}
            style={styles.animation}
            onAnimationFinish={() => {
              setError(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F7F9FC",
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#007BFF",
    fontSize: 14,
  },
  loadingAnimation: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 100,
    height: 100,
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  animationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  animation: {
    width: 600,
    height: 600,
  },
  lottieTopLeft: {
    position: "absolute",
    top: -100,
    left: 0,
    width: 500,
    height: 500,
  },
  lottieBottomRight: {
    position: "absolute",
    bottom: 0,
    right: -90,
    width: 500,
    height: 500,
    transform: [{ rotate: "90deg" }],
  },
});

export default LoginScreen;
