import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Debt } from "../types/Debt";

interface CardDebtProps {
    debt: Debt;
    onSettle?: (id: string) => void;
}

export const CardDebt: React.FC<CardDebtProps> = ({ debt, onSettle }) => (
    <View style={styles.card}>
        <View style={styles.row}>
            <View>
                <Text style={styles.title}>{debt.title}</Text>
                <Text style={styles.creditor}>{debt.creditor}</Text>
            </View>
            <Text style={styles.amount}>
                {debt.amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
            </Text>
        </View>
        <TouchableOpacity
            style={styles.settleBtn}
            onPress={() => onSettle && onSettle(debt.id)}
            activeOpacity={0.8}
        >
            <Text style={styles.checkIcon}>✔️</Text>
            <Text style={styles.settleText}>Marcar como saldada</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#6C1AEF",
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
    },
    creditor: {
        color: "#e0d7fa",
        fontSize: 16,
    },
    amount: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },
    settleBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 18,
        alignSelf: "flex-start",
    },
    checkIcon: {
        fontSize: 22,
        marginRight: 8,
        color: "#6C1AEF",
    },
    settleText: {
        color: "#6C1AEF",
        fontWeight: "bold",
        fontSize: 17,
    },
});
