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
    const debtsBetween = useDebts("betweenUsers", "DEBTOR", "ACCEPTED");
    const debtsQuick = useDebts("quick", "DEBTOR", "PENDING");

    const mappedDebts = [
        ...debtsBetween.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose ?? "",
            creditor: debt.creditorSummary
                ? `${debt.creditorSummary.firstName ?? ""} ${debt.creditorSummary.lastName ?? ""}`.trim()
                : debt.targetUserName ?? "",
            amount: debt.amount ?? 0,
            status: debt.status ?? "PENDING",
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

    const loading = debtsBetween.loading || debtsQuick.loading;
    const refresh = () => {
        debtsBetween.refresh();
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
                keyExtractor={(item) => item.id}
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