import { View, Text, StyleSheet } from "react-native";

export default function GroupsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grupos</Text>
      <Text style={styles.description}>
        Aquí podrás crear y administrar grupos de personas para dividir gastos.
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
