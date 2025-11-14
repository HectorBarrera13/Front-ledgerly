import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Button } from "@/components/Button";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.description}>
        Bienvenido de nuevo! Por favor, ingresa tus credenciales para continuar
      </Text>
      <Link href="/signup">¿No tienes una cuenta? Regístrate aquí.</Link>
      <Link href="/(tabs)/debts">Ir a la página principal</Link>
      <Button title="Iniciar sesión" onPress={() => {}} />
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
