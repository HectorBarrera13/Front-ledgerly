import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import debtService from "@/services/debtService";
import { DebtBetweenUsers, QuickDebt } from "@/types/Debt";

export default function EditDebtScreen() {
    const router = useRouter();
    const { id, type } = useLocalSearchParams();
    const [concept, setConcept] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [debt, setDebt] = useState<DebtBetweenUsers | QuickDebt | null>(null);

   useEffect(() => {
        const fetchDebt = async () => {
            setLoading(true);
            try {
                let result: DebtBetweenUsers | QuickDebt;
                if (type === "betweenUsers") {
                    result = await debtService.fetchDebtsBetweenUsersById(id as string) as DebtBetweenUsers;
                } else {
                    result = await debtService.fetchQuickDebtById(id as string) as QuickDebt;
                }
                console.log("Fetched debt:", result);
                setDebt(result); 
                setConcept(result.purpose || "");
                setAmount(String(result.amount));
                setDescription(result.description || "");
            } catch {
                Alert.alert("Permiso denegado", "No tienes permisos para editar esta deuda.")
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDebt();
    }, [id, type]);

    const canSave = concept.trim() !== "" && amount.trim() !== "";

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                new_purpose: concept,
                new_description: description,
                new_amount: Math.round(parseFloat(String(amount)) * 100),
                new_currency: "MXN",
            };
            if (type === "betweenUsers") {
                console.log("Editing debt between users with payload:", payload);
                await debtService.editDebtBetweenUsers(id as string, payload as unknown as Partial<DebtBetweenUsers>);
            } else {
                await debtService.editQuickDebt(id as string, payload as unknown as Partial<QuickDebt>);
            }
            router.replace({
                pathname: "debts/receivable",
            });
        } catch (error) {
            console.log("EDIT ERROR:", error); 
            Alert.alert("Error", "No se pudo editar la deuda.");
        } finally {
            setLoading(false);
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
            <Text style={styles.title}>Editar deuda</Text>
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
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "#555" },
    input: { marginBottom: 12 },
    button: { marginTop: 24, backgroundColor: "#6C1ED6" },
});