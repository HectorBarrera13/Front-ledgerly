import React from "react";
import { View, StyleSheet, RefreshControl, FlatList } from "react-native";
import ButtonAdd from "@/components/ButtonAdd";
import { useRouter } from "expo-router";
import { useDebts } from "@/hooks/useDebts";
import CardDebt from "@/components/debts/debtCard";

export default function ReceivableView() {
    const router = useRouter();
    const debtsBetween = useDebts("betweenUsers", "CREDITOR", "PENDING");
    const debtsQuick = useDebts("quick", "CREDITOR", "PENDING");

    const mappedDebts = [
        ...debtsBetween.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose,
            creditor: debt.debtorSummary
                ? `${debt.debtorSummary.firstName} ${debt.debtorSummary.lastName}`
                : debt.targetUserName ?? "",
            amount: debt.amount,
        })),
        ...debtsQuick.debts.map((debt: any) => ({
            id: debt.id,
            title: debt.purpose,
            creditor: debt.targetUserName ?? "",
            amount: debt.amount,
        })),
    ];

    const loading = debtsBetween.loading || debtsQuick.loading;
    const refresh = () => {
        debtsBetween.refresh();
        debtsQuick.refresh();
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <FlatList
                data={mappedDebts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CardDebt
                        debt={item}
                        onSettle={() => router.push(`(modals)/debtDetails?id=${item.id}&mode=receivable`)}
                    />
                )}
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} />
                }
            />
            <View style={styles.addBtnContainer}>
                <ButtonAdd onPress={() => router.push("(modals)/newDebt")} />
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
});