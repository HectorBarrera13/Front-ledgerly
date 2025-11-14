import { View, Text, StyleSheet } from "react-native";

export default function ConfirmDebt() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar datos</Text>
      <Text style={styles.description}>
        Revisa la información antes de guardar la deuda.
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
