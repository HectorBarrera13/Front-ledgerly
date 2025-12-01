import React, { useState } from "react";
import { View, StyleSheet, RefreshControl, FlatList, Text } from "react-native";
import ButtonAdd from "@/components/ButtonAdd";
import { useRouter } from "expo-router";
import { useDebts } from "@/hooks/useDebts";
import CardDebt from "@/components/debts/debtCard";
import { DebtStatusText } from "@type/Debt";

export default function ReceivableView() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false); 
    const debtsBetweenPending = useDebts("betweenUsers", "CREDITOR", "PENDING");
    const debtsBetweenAccepted = useDebts("betweenUsers", "CREDITOR", "ACCEPTED");
    const debtsBetweenRejected = useDebts("betweenUsers", "CREDITOR", "REJECTED");
    const debtsBetweenPaymentPending = useDebts("betweenUsers", "CREDITOR", "PAYMENT_CONFIRMATION_PENDING");
    const debtsBetweenPaymentRejected = useDebts("betweenUsers", "CREDITOR", "PAYMENT_CONFIRMATION_REJECTED");

    const debtsQuick = useDebts("quick", "CREDITOR", "PENDING");


       const mappedDebts = [
        ...debtsBetweenPending.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.debtorSummary
                ? `${debt.debtorSummary.firstName ?? ""} ${debt.debtorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "PENDING",
            type: "betweenUsers",
        })),
        ...debtsBetweenAccepted.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.debtorSummary
                ? `${debt.debtorSummary.firstName ?? ""} ${debt.debtorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "ACCEPTED",
            type: "betweenUsers",
        })),
        ...debtsBetweenRejected.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.debtorSummary
                ? `${debt.debtorSummary.firstName ?? ""} ${debt.debtorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "REJECTED",
            type: "betweenUsers",
        })),
        ...debtsBetweenPaymentPending.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.debtorSummary
                ? `${debt.debtorSummary.firstName ?? ""} ${debt.debtorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "PAYMENT_CONFIRMATION_PENDING",
            type: "betweenUsers",
        })),
        ...debtsBetweenPaymentRejected.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.debtorSummary
                ? `${debt.debtorSummary.firstName ?? ""} ${debt.debtorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "PAYMENT_CONFIRMATION_REJECTED",
            type: "betweenUsers",
        })),
        ...debtsQuick.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "PENDING",
            type: "quick",
        })),
    ];

    const loading =
        debtsBetweenPending.loading ||
        debtsBetweenAccepted.loading ||
        debtsBetweenRejected.loading ||
        debtsBetweenPaymentPending.loading ||
        debtsBetweenPaymentRejected.loading ||
        debtsQuick.loading;

    const refresh = () => {
        debtsBetweenPending.refresh();
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
                        onPress={() => router.push(`(modals)/debtDetails?id=${item.id}&mode=receivable&type=${item.type}`)}
                    />
                )}
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tienes deudas por cobrar.</Text>
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