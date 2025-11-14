import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DebtDetail() {
  const { debtId } = useLocalSearchParams<{ debtId?: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de deuda</Text>
      <Text style={styles.description}>
        ID seleccionado: {debtId ?? "sin especificar"}
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
