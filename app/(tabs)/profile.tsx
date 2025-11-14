import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { logout } = useAuth(); // 👈 accedemos al logout

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.description}>
        Configura tu información personal y métodos de pago.
      </Text>

      <View style={{ marginTop: 32 }}>
        <Button title="Cerrar sesión" onPress={logout} />
      </View>
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
