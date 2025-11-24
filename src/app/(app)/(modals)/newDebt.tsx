import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import { useRouter } from "expo-router";
import CloseButton from "@/components/CloseButton";


export default function NewDebtScreen() {
    const router = useRouter();
    const [concept, setConcept] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleContinue = () => {
        router.push({
            pathname: "finish",
            params: { concept, amount, description },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Nueva deuda</Text>
                <CloseButton style={styles.closeBtn} onPress={() => router.back()} />
            </View>
            <Input
                label="Concepto"
                value={concept}
                onChangeText={setConcept}
                style={styles.input}
            />
            <Input
                label="Monto"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />
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
                style={styles.continueBtn}
                textStyle={styles.continueText}
            />
        </View>
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
});