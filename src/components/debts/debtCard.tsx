import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Debt } from "@type/Debt";
import StatusIcon from "@asset/icon/icon_status.svg";

interface CardDebtProps {
    debt: Debt;
    onSettle?: (id: string) => void;
    onPress?: (id: string) => void;
}

const formatAmount = (amount: number) => {
    if (amount >= 1_000_000) {
        return `$${(amount / 1_000_000).toFixed(2)}M`;
    }
    return amount.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatTitle = (title: string) => {
    if (title.length > 14) {
        return title.slice(0, 13) + "...";
    }
    return title;
};

export const CardDebt: React.FC<CardDebtProps> = ({ debt, onSettle, onPress }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={() => onPress?.(debt.id)}>
        <View style={styles.row}>
            <View style={styles.titleContainer}>
                <Text
                    style={styles.title}
                >
                    {formatTitle(debt.title)}
                </Text>
                <Text style={styles.creditor}>{debt.creditor}</Text>
            </View>
            <Text style={styles.amount}>
                {formatAmount(debt.amount)}
            </Text>
        </View>
        <TouchableOpacity
            style={styles.settleBtn}
            onPress={() => onSettle?.(debt.id)}
            activeOpacity={0.8}
        >
            <StatusIcon width={22} height={22} style={styles.checkIcon} />
            <Text style={styles.settleText}>Estatus</Text>
        </TouchableOpacity>
    </TouchableOpacity>
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
    titleContainer: {
        maxWidth: 180,
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
        marginLeft: 8,
        minWidth: 70,
        textAlign: "right",
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
        opacity: 0.9,
    },
    settleText: {
        color: "#6C1AEF",
        fontWeight: "bold",
        fontSize: 17,
    },
});

export default CardDebt;