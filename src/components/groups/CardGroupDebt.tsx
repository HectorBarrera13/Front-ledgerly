import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import StatusIcon from "@asset/icon/icon_status.svg";
import { DebtStatusText, DebtBetweenUsers } from "@/types/Debt";
import AvatarInitials from "@/components/AvatarInitials";
import { useAuth } from "@/providers/AuthContext";

interface CardGroupDebtProps {
    debt: DebtBetweenUsers;
    onPress?: (id: string) => void;
    onSettle?: (id: string) => void;
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

const formatTitle = (purpose?: string) => {
    const value = purpose ?? "Sin título";
    return value.length > 14 ? value.slice(0, 13) + "..." : value;
};

const CardGroupDebt: React.FC<CardGroupDebtProps> = ({ debt, onPress, onSettle }) => {
    const { profile } = useAuth();
    const currentUserId = profile?.user?.id;
    const isDebtor = currentUserId === debt.debtorSummary.userId;
    const showUser = isDebtor ? debt.creditorSummary : debt.debtorSummary;
    const userName = `${showUser.firstName} ${showUser.lastName}`;

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.95}
            onPress={() => onPress?.(debt.id)}
        >
            <View style={styles.row}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {formatTitle(debt.purpose)}
                    </Text>
                    <Text style={styles.creditor}>{userName}</Text>
                </View>
                <Text style={styles.amount}>
                    {formatAmount(debt.amount ?? 0)}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.settleBtn}
                onPress={() => onSettle?.(debt.id)}
                activeOpacity={0.8}
            >
                <StatusIcon width={22} height={22} style={styles.checkIcon} />
                <Text style={styles.settleText}>
                    {DebtStatusText[debt.status] ?? "Desconocido"}
                </Text>
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
                <AvatarInitials
                    firstName={showUser.firstName}
                    lastName={showUser.lastName}
                    size={32}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#6C1AEF",
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        position: "relative",
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
    avatarContainer: {
        position: "absolute",
        bottom: 12,
        right: 12,
    },
});

export default CardGroupDebt;