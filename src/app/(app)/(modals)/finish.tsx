import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DebtInfo from "@/components/debts/DebtInfo";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import CloseButton from "@/components/CloseButton";

export default function FinishDebtScreen() {
    const router = useRouter();
    const { concept = "", amount = "0", description = "" } = useLocalSearchParams();

    const [creditor, setCreditor] = useState("");
    const [debtor, setDebtor] = useState("");

    const canCreate = creditor.length > 0 && debtor.length > 0;

    const handleCreate = () => {
        // Aquí va la lógica para crear la deuda
        router.replace("/debts");
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Nueva deuda</Text>
                <CloseButton style={styles.closeBtn} onPress={() => router.replace("/debts")} />
            </View>
            <DebtInfo
                concept={String(concept)}
                description={String(description)}
                amount={parseFloat(String(amount))}
            />
            <Input
                label="Acreedor"
                value={creditor}
                onChangeText={setCreditor}
                placeholder="Selecciona el acreedor"
                style={styles.input}
            />
            <Input
                label="Deudor"
                value={debtor}
                onChangeText={setDebtor}
                placeholder="Selecciona el deudor"
                style={styles.input}
            />
            <Button
                title="Crear"
                onPress={handleCreate}
                disabled={!canCreate}
                style={[styles.button, !canCreate && styles.buttonDisabled]}
            />
        </KeyboardAvoidingView>
    );
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
});