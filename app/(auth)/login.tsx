import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import { Button } from "@/components/Button";
import { AuthInput } from "@/components/AuthInput";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.description}>
        Bienvenido de nuevo! Por favor, ingresa tus credenciales
      </Text>

      <Link href="/(auth)/signup">¿No tienes una cuenta? Regístrate aquí.</Link>

      <AuthInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <AuthInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? "Cargando..." : "Iniciar sesión"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
});
