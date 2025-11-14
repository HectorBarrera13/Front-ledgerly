import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function Receive() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deudas por recibir</Text>
      <Text style={styles.description}>
        Aquí se listan los pagos pendientes que otras personas te deben.
      </Text>
      <Pressable onPress={() => router.push("/")} style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>DEscriopcion de deuda</Text>
      </Pressable>
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
