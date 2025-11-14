import { View, Text, StyleSheet } from "react-native";

export default function CreateDebt() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear nueva deuda</Text>
      <Text style={styles.description}>
        Aquí podrás capturar la información para registrar una deuda.
      </Text>
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
