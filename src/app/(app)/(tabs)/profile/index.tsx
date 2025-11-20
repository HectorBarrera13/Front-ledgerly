import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@provider/AuthContext";
import { authService } from "@service/authService";

export default function ProfileView() {
    const { session } = useAuth();
    const user = session?.profile.user;
    const email = session?.profile.account.email;
    const isLoading = false;

    const onLogout = async () => {
        try {
            await authService.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
            >
                Profile
            </Text>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    Name: {user?.firstName} {user?.lastName}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    Email: {email}
                </Text>
                {user?.phone && (
                    <Text style={{ fontSize: 16 }}>Phone: {user.phone}</Text>
                )}
            </View>

            <TouchableOpacity
                onPress={onLogout}
                disabled={isLoading}
                style={{
                    backgroundColor: "#dc3545",
                    padding: 15,
                    borderRadius: 5,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                    {isLoading ? "Logging out..." : "Logout"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
