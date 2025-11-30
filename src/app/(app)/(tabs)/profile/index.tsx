import { View, Text, ScrollView } from "react-native";
import { useAuth } from "@provider/AuthContext";
import { authService } from "@service/authService";
import { Button } from "@/components/Button";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import friendService from "@/services/friendService";

export default function ProfileView() {
    const { profile } = useAuth();
    const user = profile?.user;
    const email = profile?.account.email;

    const onLogout = async () => {
        try {
            await authService.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getInitials = () => {
        const first = user?.firstName?.charAt(0) || "";
        const last = user?.lastName?.charAt(0) || "";
        return `${first}${last}`.toUpperCase();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{getInitials()}</Text>
                </View>
                <Text style={styles.userName}>
                    {user?.firstName} {user?.lastName}
                </Text>
                <Text style={styles.userEmail}>{email}</Text>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Información Personal</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre completo</Text>
                    <Text style={styles.infoValue}>
                        {user?.firstName} {user?.lastName}
                    </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Correo electrónico</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono</Text>
                    <Text style={styles.infoValue}>{user?.phone}</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <Button
                    title="Generar mi QR"
                    onPress={() => router.push("generateQr")}
                    style={styles.qrButton}
                />
                <Button
                    title="Cerrar sesión"
                    onPress={onLogout}
                    style={styles.logoutButton}
                    textStyle={styles.logoutButtonText}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        backgroundColor: "#7519EB",
        paddingTop: 63,
        paddingBottom: 30,
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: "700",
        color: "#7519EB",
    },
    userName: {
        fontSize: 26,
        fontWeight: "700",
        color: "white",
        marginBottom: 6,
    },
    userEmail: {
        fontSize: 15,
        color: "rgba(255, 255, 255, 0.9)",
    },
    infoCard: {
        backgroundColor: "white",
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 20,
    },
    infoRow: {
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 13,
        color: "#888",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        color: "#1a1a1a",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#f0f0f0",
    },
    actionsContainer: {
        paddingHorizontal: 20,
        marginTop: 32,
        marginBottom: 40,
        gap: 12,
    },
    qrButton: {
        width: "100%",
        backgroundColor: "#7519EB",
        paddingVertical: 16,
    },
    logoutButton: {
        width: "100%",
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#E53E3E",
        paddingVertical: 16,
    },
    logoutButtonText: {
        color: "#E53E3E",
    },
});