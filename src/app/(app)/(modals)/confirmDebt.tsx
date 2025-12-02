import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import DebtInfo from "@/components/debts/DebtInfo";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import DebtModalHeader from "@/components/debts/DebtModalHeader";
import FriendSuggestionsList from "@/components/debts/FriendSuggestionsList";
import { useDebtFriendSuggestions } from "@/hooks/useDebtFriendSuggestions";
import debtService from "@/services/debtService";

export default function ConfirmDebtScreen() {
    const router = useRouter();
    const {
        concept = "",
        amount = "0",
        description = "",
    } = useLocalSearchParams();

    const [myRole, setMyRole] = useState<"CREDITOR" | "DEBTOR">("DEBTOR");
    const [targetName, setTargetName] = useState("");
    const [selectedFriend, setSelectedFriend] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const { friendSuggestions, loadingSuggestions } = useDebtFriendSuggestions(
        myRole,
        targetName
    );

    const canCreate = targetName.trim().length > 0 && !loading;

    const handleCreate = async () => {
        setLoading(true);
        const payloadBase = {
            purpose: String(concept),
            description:
                typeof description === "string"
                    ? description
                    : Array.isArray(description)
                      ? description.join(", ")
                      : null,
            currency: "MXN",
            amount: Math.round(parseFloat(String(amount)) * 100),
            myRole: myRole,
        };

        try {
            if (selectedFriend) {
                await debtService.newDebtBetweenUsers({
                    ...payloadBase,
                    targetUserId: selectedFriend.id,
                } as any);
            } else {
                await debtService.newDebtQuick({
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
            <DebtModalHeader title="Nueva deuda" />
            <DebtInfo
                concept={String(concept)}
                description={String(description)}
                amount={parseFloat(String(amount))}
            />
            <View
                style={{ flexDirection: "row", marginTop: 8, marginBottom: 8 }}
            >
                <TouchableOpacity
                    style={[
                        styles.roleBtn,
                        myRole === "DEBTOR" && styles.roleBtnActive,
                    ]}
                    onPress={() => setMyRole("DEBTOR")}
                >
                    <Text
                        style={
                            myRole === "DEBTOR"
                                ? styles.roleTextActive
                                : styles.roleText
                        }
                    >
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
                    <Text
                        style={
                            myRole === "CREDITOR"
                                ? styles.roleTextActive
                                : styles.roleText
                        }
                    >
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
            {myRole === "CREDITOR" &&
                friendSuggestions.length > 0 &&
                !selectedFriend && (
                    <FriendSuggestionsList
                        suggestions={friendSuggestions}
                        onSelect={handleSelectFriend}
                    />
                )}
            <Button
                title={loading ? "Creando..." : "Crear"}
                onPress={handleCreate}
                disabled={!canCreate}
                style={[styles.button, !canCreate && styles.buttonDisabled]}
            />
        </SafeAreaView>
    );
}

export const options = {
    headerShown: false,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
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
});
