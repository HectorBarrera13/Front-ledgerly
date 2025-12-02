import React, { useState } from "react";
import { View, StyleSheet, RefreshControl, FlatList, Text } from "react-native";
import ButtonAdd from "@/components/ButtonAdd";
import { useRouter } from "expo-router";
import { useDebts } from "@/hooks/useDebts";
import CardDebt from "@/components/debts/debtCard";
import { DebtStatusText } from "@type/Debt";

export default function PayableView() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false); 
    const debtsBetweenAccepted = useDebts("betweenUsers", "DEBTOR", "ACCEPTED");
    const debtsBetweenRejected = useDebts("betweenUsers", "DEBTOR", "REJECTED");
    const debtsBetweenPaymentPending = useDebts("betweenUsers", "DEBTOR", "PAYMENT_CONFIRMATION_PENDING");
    const debtsBetweenPaymentRejected = useDebts("betweenUsers", "DEBTOR", "PAYMENT_CONFIRMATION_REJECTED");

    const debtsQuick = useDebts("quick", "DEBTOR", "PENDING");

    const mappedDebts = [
        ...debtsBetweenAccepted.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.creditorSummary
                ? `${debt.creditorSummary.firstName ?? ""} ${debt.creditorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "ACCEPTED",
            type: "betweenUsers",
        })),
        ...debtsBetweenRejected.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.creditorSummary
                ? `${debt.creditorSummary.firstName ?? ""} ${debt.creditorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "REJECTED",
            type: "betweenUsers",
        })),
        ...debtsBetweenPaymentPending.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.creditorSummary
                ? `${debt.creditorSummary.firstName ?? ""} ${debt.creditorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "PAYMENT_CONFIRMATION_PENDING",
            type: "betweenUsers",
        })),
        ...debtsBetweenPaymentRejected.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.creditorSummary
                ? `${debt.creditorSummary.firstName ?? ""} ${debt.creditorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "PAYMENT_CONFIRMATION_REJECTED",
            type: "betweenUsers",
        })),
        ...debtsQuick.debts
            .filter((debt: any) => debt.status !== "PAYMENT_CONFIRMED")
            .map((debt: any) => ({
                id: debt.id,
                title: debt.purpose ?? "",
                creditor: debt.targetUserName ?? "",
                amount: debt.amount ?? 0,
                status: debt.status ?? "PENDING",
                type: "quick",
            })),
    ];

    const loading =
        debtsBetweenAccepted.loading ||
        debtsBetweenRejected.loading ||
        debtsBetweenPaymentPending.loading ||
        debtsBetweenPaymentRejected.loading ||
        debtsQuick.loading;

    const refresh = () => {
        debtsBetweenAccepted.refresh();
        debtsBetweenRejected.refresh();
        debtsBetweenPaymentPending.refresh();
        debtsBetweenPaymentRejected.refresh();
        debtsQuick.refresh();
    };

    const handleAddPress = () => {
        if (!isNavigating) {
            setIsNavigating(true);
            router.push("(modals)/newDebt");
            setTimeout(() => setIsNavigating(false), 1000); 
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <FlatList
                data={mappedDebts}
                keyExtractor={(item) => `${item.id}-${item.type}-${item.status}`}
                renderItem={({ item }) => (
                    <CardDebt
                        debt={item}
                        onPress={() => router.push(`(modals)/debtDetails?id=${item.id}&mode=payable&type=${item.type}`)}
                    />
                )}
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tienes deudas por pagar.</Text>
                }
            />
            <View style={styles.addBtnContainer}>
                <ButtonAdd onPress={handleAddPress} disabled={isNavigating} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 24,
    },
    addBtnContainer: {
        position: "absolute",
        bottom: 24,
        paddingRight: 24,
        alignSelf: "flex-end",
    },
    emptyText: {
        textAlign: "center",
        color: "#888",
        marginTop: 32,
    },
});