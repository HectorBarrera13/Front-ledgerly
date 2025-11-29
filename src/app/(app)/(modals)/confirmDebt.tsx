import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import DebtInfo from "@/components/debts/DebtInfo";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import { authService } from "@/services/authService";

const MOCK_FRIENDS = [
    { id: "1", name: "Tony Polanco" },
    { id: "2", name: "Ana López" },
    { id: "3", name: "Carlos Ruiz" },
    { id: "4", name: "Taría García" },
    { id: "5", name: "Tuis Fernández" },
    { id: "6", name: "Tuis Martínez" },
    
];

export default function FinishDebtScreen() {
    const router = useRouter();
    const { concept = "", amount = "0", description = "" } = useLocalSearchParams();

    const [myRole, setMyRole] = useState<"CREDITOR" | "DEBTOR">("DEBTOR");
    const [targetName, setTargetName] = useState("");
    const [selectedFriend, setSelectedFriend] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const friendSuggestions = targetName.length > 0
        ? MOCK_FRIENDS.filter(f =>
            f.name.toLowerCase().includes(targetName.toLowerCase())
        )
        : [];

    const canCreate = targetName.trim().length > 0 && !loading;

    const handleCreate = async () => {
        setLoading(true);
        const payloadBase = {
            purpose: String(concept),
            description: typeof description === "string" ? description : (Array.isArray(description) ? description.join(", ") : null),
            currency: "MXN",
            amount: Math.round(parseFloat(String(amount)) * 100),
            myRole: myRole,
        };

        try {
            if (selectedFriend) {
                await authService.newDebtBetweenUsers({
                    ...payloadBase,
                    targetUserId: selectedFriend.id,
                } as any); 
            } else {
                await authService.newDebtQuick({
                    ...payloadBase,
                    targetUserName: targetName,
                });
            }
            router.replace("/debts");
        } catch (err) {
            Alert.alert("Error", "No se pudo crear la deuda.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFriend = (friend: { id: string; name: string }) => {
        setTargetName(friend.name);
        setSelectedFriend(friend);
    };

    const handleChangeTargetName = (text: string) => {
        setTargetName(text);
        setSelectedFriend(null);
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <Text style={styles.title}>Nueva deuda</Text>
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => router.replace("/debts")}
                >
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>
            <DebtInfo
                concept={String(concept)}
                description={String(description)}
                amount={parseFloat(String(amount))}
            />
            <View style={{ flexDirection: "row", marginTop: 8, marginBottom: 8 }}>
                <TouchableOpacity
                    style={[
                        styles.roleBtn,
                        myRole === "DEBTOR" && styles.roleBtnActive,
                    ]}
                    onPress={() => setMyRole("DEBTOR")}
                >
                    <Text style={myRole === "DEBTOR" ? styles.roleTextActive : styles.roleText}>
                        Soy Deudor
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.roleBtn,
                        myRole === "CREDITOR" && styles.roleBtnActive,
                    ]}
                    onPress={() => setMyRole("CREDITOR")}
                >
                    <Text style={myRole === "CREDITOR" ? styles.roleTextActive : styles.roleText}>
                        Soy Acreedor
                    </Text>
                </TouchableOpacity>
            </View>
            <Input
                label={myRole === "CREDITOR" ? "Deudor" : "Acreedor"}
                value={targetName}
                onChangeText={handleChangeTargetName}
                placeholder={`Nombre del ${myRole === "CREDITOR" ? "deudor" : "acreedor"}`}
                style={styles.input}
            />
            {/* Sugerencias de amigos */}
            {friendSuggestions.length > 0 && !selectedFriend && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={friendSuggestions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.suggestionItem}
                                onPress={() => handleSelectFriend(item)}
                            >
                                <Text style={styles.suggestionText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
            <Button
                title={loading ? "Creando..." : "Crear"}
                onPress={handleCreate}
                disabled={!canCreate}
                style={[styles.button, (!canCreate) && styles.buttonDisabled]}
            />
        </SafeAreaView>
    );
}

export const options = {
    headerShown: false,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#555",
        textAlign: "center",
        flex: 1,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#e5e5e5",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    closeText: {
        fontSize: 22,
        color: "#555",
    },
    input: {
        marginTop: 8,
    },
    button: {
        marginTop: 32,
        width: "100%",
        height: 56,
        borderRadius: 32,
    },
    buttonDisabled: {
        backgroundColor: "#bbb",
    },
    roleBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 20,
        backgroundColor: "#e5e5e5",
        marginHorizontal: 4,
        alignItems: "center",
    },
    roleBtnActive: {
        backgroundColor: "#555",
    },
    roleText: {
        color: "#555",
        fontWeight: "600",
    },
    roleTextActive: {
        color: "#fff",
        fontWeight: "700",
    },
    suggestionsContainer: {
        marginTop: 4,
        marginBottom: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    suggestionText: {
        fontSize: 16,
        color: "#555",
    },
});