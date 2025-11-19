import { View, Text, StyleSheet, Button } from "react-native";
import { authService } from "@/services/authService";

export default function ProfileScreen() {
    const handleSignOut = async () => {
        try {
            await authService.signOut();
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <Text style={styles.description}>
                Configura tu información personal y métodos de pago.
            </Text>

            <View style={{ marginTop: 32 }}>
                <Button title="Cerrar sesión" onPress={handleSignOut} />
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
