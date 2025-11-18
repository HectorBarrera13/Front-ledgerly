import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "@/components/Button";
import { AuthInput } from "@/components/AuthInput";
import { useAuth } from "@/context/AuthContext";

export default function SignupScreen() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await register(
        firstName,
        lastName,
        email,
        password,
        { country_code: countryCode, number: phoneNumber }
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.description}>
        Crea una cuenta nueva para comenzar a usar Ledgerly
      </Text>
      <AuthInput
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <AuthInput
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <AuthInput
        placeholder="Código de país (ej: +52)"
        value={countryCode}
        onChangeText={setCountryCode}
      />
      <AuthInput
        placeholder="Teléfono"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <AuthInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <AuthInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? "Registrando..." : "Registrarse"}
        onPress={handleRegister}
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
