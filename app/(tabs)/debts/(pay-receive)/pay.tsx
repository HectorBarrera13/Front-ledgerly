import { View, Text, StyleSheet, Pressable } from "react-native";
import { router, useRouter } from "expo-router";

export default function Pay() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deudas por pagar</Text>
      <Text style={styles.description}>
        Aquí podrás ver todas las deudas que debes liquidar.
      </Text>
      <Pressable
        onPress={() => router.push("/(tabs)/debts/24")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "blue" }}>Marcar como pagada</Text>
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
