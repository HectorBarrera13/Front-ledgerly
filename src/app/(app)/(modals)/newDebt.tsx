import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import DebtModalHeader from "@/components/debts/DebtModalHeader";
import { useNewDebtForm } from "@/hooks/useNewDebtForm";

export default function NewDebtScreen() {
    const router = useRouter();
    const {
        concept,
        setConcept,
        amount,
        description,
        setDescription,
        amountWarning,
        canContinue,
        handleAmountChange,
    } = useNewDebtForm();

    const handleContinue = () => {
        router.push({
            pathname: "confirmDebt",
            params: { concept, amount, description },
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <DebtModalHeader title="Nueva deuda" action="back"/>
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