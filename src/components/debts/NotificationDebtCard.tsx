import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Debt, DebtStatusText } from "@type/Debt";
import StatusIcon from "@asset/icon/icon_status.svg";
import { Button } from "@/components/Button";
import debtService from "@/services/debtService";

interface NotificationDebtCardProps {
    debt: Debt;
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
    onPress?: (id: string) => void;
    showActions?: boolean; 
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

const formatTitle = (title?: string, purpose?: string) => {
    const value = title ?? purpose ?? "Sin título";
    return value.length > 14 ? value.slice(0, 13) + "..." : value;
};

const NotificationDebtCard: React.FC<NotificationDebtCardProps> = ({
    debt,
    onAccept,
    onReject,
    onPress,
    showActions = false,
}) => (
    <TouchableOpacity
        style={styles.card}
        activeOpacity={0.95}
        onPress={() => onPress?.(debt.id)}
    >
        <View style={styles.row}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    {formatTitle(debt.title, debt.purpose)}
                </Text>
                <Text style={styles.creditor}>{debt.creditor ?? ""}</Text>
            </View>
            <Text style={styles.amount}>
                {formatAmount(debt.amount ?? 0)}
            </Text>
        </View>
        {showActions && (
            <View style={styles.actions}>
                <Button
                    title="Aceptar"
                    onPress={() => {
                        
                        onAccept?.(debt.id);
                  }}
                    style={styles.acceptBtn}
                    textStyle={{color:"#000"}}
                />
                <Button
                    title="Rechazar"
                    onPress={() => {
                        
                        onReject?.(debt.id);
                    }}
                    style={styles.rejectBtn}
                />
            </View>
        )}
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
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
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
    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
        justifyContent: "center",

    },
    acceptBtn: {
        backgroundColor: "#fff",
        flex: 1,
    },
    rejectBtn: {
        backgroundColor: "transparent",
        flex: 1,
        borderWidth: 1,
        borderColor: "#fff",

    },
});

export default NotificationDebtCard;