import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useDebts } from "@/hooks/useDebts";
import { useAuth } from "@/providers/AuthContext";
import debtService from "@/services/debtService";
import NotificationDebtCard from "@/components/debts/NotificationDebtCard";
import { useRouter } from "expo-router";

export default function NotificationsView() {
    const router = useRouter();
    const { profile } = useAuth();
    const debtsBetween = useDebts("betweenUsers", "DEBTOR", "PENDING");
    const loading = debtsBetween.loading;

    const handleAccept = async (debtId: string) => {
        await debtService.acceptDebtBetweenUsers(debtId);
        debtsBetween.refresh();
    };

    const handleReject = async (debtId: string) => {
        await debtService.rejectDebtBetweenUsers(debtId);
        debtsBetween.refresh();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notificaciones</Text>
            <FlatList
                data={debtsBetween.debts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    if ("creditorSummary" in item && item.creditorSummary) {
                        const creditor = `${item.creditorSummary.firstName ?? ""} ${item.creditorSummary.lastName ?? ""}`.trim();
                        return (
                            <NotificationDebtCard
                                debt={{
                                    id: item.id,
                                    title: item.purpose ?? "",
                                    creditor,
                                    amount: item.amount ?? 0,
                                }}
                                showActions={true}
                                onAccept={handleAccept}
                                onReject={handleReject}
                                onPress={(id) =>
                                router.push(`(modals)/debtDetails?id=${id}&mode=payable&type=betweenUsers&fromNotifications=true`)
                                }
                            />
                        );
                    }
                    return null;
                }}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={debtsBetween.refresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tienes notificaciones pendientes.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: "#fff" },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
    emptyText: { textAlign: "center", color: "#888", marginTop: 32 },
});