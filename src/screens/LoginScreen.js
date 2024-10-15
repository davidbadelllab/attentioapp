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
          navigation.replace("Home"); // Cambia a 'replace' en lugar de 'navigate'
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
        source={require("../../assets/Animation - 1729020863881.json")} // Ruta a tu archivo de animación
        autoPlay
        loop
        style={styles.lottieTopLeft}
      />
      {/* Animación en la parte inferior derecha */}
      <LottieView
        source={require("../../assets/Animation - 1729020725065.json")} // Ruta a tu archivo de animación
        autoPlay
        loop
        style={styles.lottieBottomRight}
      />

      <Image
        source={require("../../assets/logoDark.png")} // Asegúrate de que esta ruta sea correcta
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
          source={require("../../assets/loading.json")} // Asegúrate de que esta ruta sea correcta
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      )}

      {success && (
        <View style={styles.animationOverlay}>
          <LottieView
            source={require("../../assets/acepted.json")} // Ruta a tu archivo de animación de éxito
            autoPlay
            loop={false}
            style={styles.animation}
            onAnimationFinish={() => {
              setSuccess(false); // Resetear estado de éxito
            }}
          />
        </View>
      )}

      {error && (
        <View style={styles.animationOverlay}>
          <LottieView
            source={require("../../assets/error.json")} // Ruta a tu archivo de animación de error
            autoPlay
            loop={false}
            style={styles.animation}
            onAnimationFinish={() => {
              setError(false); // Resetear estado de error
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
    backgroundColor: "#F7F9FC", // Color de fondo
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
    backgroundColor: "#ffffff", // Color del campo de entrada
  },
  button: {
    backgroundColor: "#007BFF", // Color del botón
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
    width: 100, // Ajusta el tamaño según sea necesario
    height: 100, // Ajusta el tamaño según sea necesario
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
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo blanco con un poco de transparencia
    zIndex: 1,
  },
  animation: {
    width: 600, // Tamaño de la animación
    height: 600, // Tamaño de la animación
  },
  lottieTopLeft: {
    position: "absolute",
    top: -100,
    left: 0,
    width: 500, // Ajusta el tamaño según sea necesario
    height: 500, // Ajusta el tamaño según sea necesario
  },
  lottieBottomRight: {
    position: "absolute",
    bottom: 0,
    right: -90,
    width: 500, // Ajusta el tamaño según sea necesario
    height: 500, // Ajusta el tamaño según sea necesario
    transform: [{ rotate: "90deg" }], // Rota 90 grados
  },
});

export default LoginScreen;
