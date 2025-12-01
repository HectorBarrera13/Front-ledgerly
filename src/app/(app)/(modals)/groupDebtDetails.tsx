import React from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import CloseButton from "@/components/CloseButton";
import { DebtStatusText } from "@/types/Debt";
import { useGroupDebtDetails } from "@/hooks/useGroupDebtDetails";

export default function GroupDebtDetailsScreen() {
    const { groupId, id } = useLocalSearchParams(); 
    const router = useRouter();
    const { debt, loading } = useGroupDebtDetails(groupId as string, id as string);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#6C1ED6" />
            </SafeAreaView>
        );
    }

    if (!debt) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No se encontró la deuda grupal.</Text>
            </SafeAreaView>
        );
    }

    const concept = debt.purpose;
    const description = debt.description;
    const amount = debt.amount;
    const status = debt.status as keyof typeof DebtStatusText;
    const currency = debt.currency || "MXN";
    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Deuda grupal</Text>
                    <CloseButton style={styles.closeButton} />
                </View>

                <Text style={styles.sectionTitle}>Concepto</Text>
                <View style={styles.inputBox}>
                    <Text style={styles.inputText}>{concept}</Text>
                </View>

                <Text style={styles.sectionTitle}>Descripción</Text>
                <View style={styles.inputBox}>
                    <Text style={styles.inputText}>{description}</Text>
                </View>

                <Text style={styles.sectionTitle}>Monto</Text>
                <View style={styles.inputBox}>
                    <Text style={styles.inputText}>
                        {amount} {currency}
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>Estatus</Text>
                <View style={styles.inputBox}>
                    <Text style={styles.inputText}>{DebtStatusText[status] ?? status}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#6C1ED6",
    },
    closeButton: {
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 8,
        color: "#333",
    },
    inputBox: {
        backgroundColor: "#F5F5F7",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    inputText: {
        fontSize: 16,
        color: "#333",
    },
    debtorRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    debtorName: {
        fontSize: 15,
        color: "#444",
        fontWeight: "500",
    },
    debtorAmount: {
        fontSize: 15,
        color: "#6C1ED6",
        fontWeight: "700",
    },
});