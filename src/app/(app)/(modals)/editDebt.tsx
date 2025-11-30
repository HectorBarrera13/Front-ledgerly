import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import { useEditDebt } from "@/hooks/useEditDebt";
import { editDebt } from "@/libs/editDebtActions";
import DebtModalHeader from "@/components/debts/DebtModalHeader";

export default function EditDebtScreen() {
    const router = useRouter();
    const { id, type } = useLocalSearchParams();

    const {
        concept,
        setConcept,
        amount,
        setAmount,
        description,
        setDescription,
        loading,
    } = useEditDebt(id as string, type as string);

    const canSave = concept.trim() !== "" && amount.trim() !== "";

    const handleSave = async () => {
        try {
            await editDebt(id as string, type as string, concept, amount, description, router);
        } catch (error) {
            Alert.alert("Error", "No se pudo editar la deuda.");
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#6C1ED6" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <DebtModalHeader title="Editar deuda" style={styles.header} action="back"/>
            <Input label="Concepto" value={concept} onChangeText={setConcept} style={styles.input} maxLength={30} />
            <Input label="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
            <Input label="Descripción" value={description} onChangeText={setDescription} multiline style={styles.input} />
            <Button
                title="Guardar cambios"
                onPress={handleSave}
                disabled={!canSave || loading}
                style={styles.button}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 24 },
    header: { alignContent: "center", marginBottom: 24 },
    input: { marginBottom: 12 },
    button: { marginTop: 24, backgroundColor: "#6C1ED6" },
});