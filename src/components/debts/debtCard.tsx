import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Debt, DebtStatusText } from "@type/Debt";
import StatusIcon from "@asset/icon/icon_status.svg";
import AvatarInitials from "@/components/AvatarInitials";

interface CardDebtProps {
    debt: Debt & {
        debtorSummary?: { firstName: string; lastName: string; picture?: string };
        creditorSummary?: { firstName: string; lastName: string; picture?: string };
    };
    onSettle?: (id: string) => void;
    onPress?: (id: string) => void;
    mode?: "payable" | "receivable";
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

const CardDebt: React.FC<CardDebtProps> = ({ debt, onSettle, onPress, mode }) => {
    const creditorParts = debt.creditor?.split(" ") ?? [];
    const firstName = creditorParts[0] ?? "";
    const lastName = creditorParts[1] ?? "";

    // En payable (deudas por pagar) mostrar foto del acreedor
    // En receivable (deudas por cobrar) mostrar foto del deudor
    const profilePicture = mode === "payable" 
        ? debt.creditorSummary?.picture 
        : debt.debtorSummary?.picture;

    return (
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
            <TouchableOpacity
                style={styles.settleBtn}
                onPress={() => onSettle?.(debt.id)}
                activeOpacity={0.8}
            >
                <StatusIcon width={22} height={22} style={styles.checkIcon} />
                <Text style={styles.settleText}>
                    {DebtStatusText[debt.status as keyof typeof DebtStatusText] ?? "Desconocido"}
                </Text>
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
                {profilePicture ? (
                    <Image
                        source={{ uri: profilePicture }}
                        style={styles.profileImage}
                    />
                ) : (
                    <AvatarInitials
                        firstName={firstName}
                        lastName={lastName}
                        size={32}
                    />
                )}
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
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f0f0f0",
    },
});

export default CardDebt;