import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function GroupsView() {
    const router = useRouter();

    const handleDetails = () => {
        // Ejemplo: navegar a la vista groupDetails pasando id=123 en la query
        router.push('/groups/groupDetails?id=123');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Grupos</Text>
            <Text style={styles.description}>
                Aquí podrás crear y administrar grupos de personas para dividir
                gastos.
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
    loginButton: {
        backgroundColor: "#7B1FFF",
        borderRadius: 30,
        width: "100%",
        marginBottom: 15,
    },
});
