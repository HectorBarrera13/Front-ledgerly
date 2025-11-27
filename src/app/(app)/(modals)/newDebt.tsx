import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Input from "@/components/Input";
import {Button} from "@/components/Button";

export default function NewDebtScreen() {
    const router = useRouter();
    const [concept, setConcept] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [amountWarning, setAmountWarning] = useState(false);

    const canContinue = concept.trim() !== "" && amount.trim() !== "" && description.trim() !== "";

    const handleAmountChange = (text: string) => {
        if (/[^0-9.]/.test(text)) {
            setAmountWarning(true);
        } else {
            setAmountWarning(false);
        }
        const numericText = text.replace(/[^0-9.]/g, "");
        setAmount(numericText);
    };

    const handleContinue = () => {
        router.push({
            pathname: "finishDebt",
            params: { concept, amount, description },
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <Text style={styles.title}>Nueva deuda</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>
            <Input
                label="Concepto"
                value={concept}
                onChangeText={setConcept}
                style={styles.input}
                maxLength={30}
            />
            <Input
                label="Monto"
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                style={styles.input}
            />
            {amountWarning && (
                <Text style={styles.warningText}>
                    Solo puedes ingresar números y punto decimal.
                </Text>
            )}
            <Input
                label="Descripción"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
            />
            <Button
                title="Continuar"
                onPress={handleContinue}
                disabled={!canContinue}
                style={[styles.continueBtn, !canContinue && { backgroundColor: "#bbb" }]}
                textStyle={styles.continueText}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 24,
        paddingTop: 36,
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
        marginBottom: 0,
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
    },
    continueBtn: {
        marginTop: 24,
        width: "100%",
        height: 56,
        borderRadius: 32,
    },
    continueText: {
        fontSize: 20,
    },
    warningText: {
        color: "#d9534f",
        fontSize: 14,
        marginBottom: 8,
        marginTop: 4,
        marginLeft: 4,
    },
});