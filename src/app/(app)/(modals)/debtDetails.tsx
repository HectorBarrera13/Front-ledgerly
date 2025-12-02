import React from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import DebtInfo from "@/components/debts/DebtInfo";
import { Button } from "@/components/Button";
import CloseButton from "@/components/CloseButton";
import { DebtStatusText } from "@/types/Debt";
import { useDebtDetails } from "@/hooks/useDebtDetails";
import { useAuth } from "@/providers/AuthContext";
import {
    reportPayment,
    verifyPayment,
    rejectPayment,
    quickConfirm,
    resendDebt,
    deleteDebtQuick
} from "@/libs/debtActions";

export default function DebtDetailScreen() {
    const { id, type } = useLocalSearchParams();
    const { debt, setDebt, loading } = useDebtDetails(id as string, type as string);
    const router = useRouter();
    const { profile } = useAuth();
    const currentUserId = profile?.user?.id;

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#6C1ED6" />
            </SafeAreaView>
        );
    }

    if (!debt) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No se encontró la deuda.</Text>
            </SafeAreaView>
        );
    }

    const mode =
        debt.debtorSummary?.userId === currentUserId ? "payable" :
        debt.creditorSummary?.userId === currentUserId ? "receivable" :
        "";
        debt.role === "DEBTOR" ? "payable" :
        debt.role === "CREDITOR" ? "receivable" :
        "";

    const isAcceptedPayable = type === "betweenUsers" && mode === "payable" && debt.status === "ACCEPTED";
    const isPendingConfirmationReceivable = type === "betweenUsers" && mode === "receivable" && debt.status === "PAYMENT_CONFIRMATION_PENDING";
    const isEditable = (debt.status === "PENDING" || debt.status === "REJECTED") && mode === "receivable";
    const isQuickEditable = type === "quick" && (debt.status === "PENDING" || debt.status === "REJECTED");
    const isQuickPending = type === "quick" && debt.status !== "PAYMENT_CONFIRMED";
    const isRejectedPayable = type === "betweenUsers" && mode === "payable" && debt.status === "PAYMENT_CONFIRMATION_REJECTED";
    const isResendable = type === "betweenUsers" && (debt.status === "REJECTED");
    const isDeletable = (debt.status === "PENDING" || debt.status === "REJECTED");


    const isBetween = debt.debtorSummary && debt.creditorSummary;
    const concept = debt.purpose;
    const description = debt.description;
    const amount = debt.amount;
    const status = debt.status as keyof typeof DebtStatusText;
    let userLabel = "";
    let userName = "";

    if (isBetween) {
        if (mode === "receivable") {
            userLabel = "Deudor";
            userName = `${debt.debtorSummary.firstName} ${debt.debtorSummary.lastName}`;
        } else {
            userLabel = "Acreedor";
            userName = `${debt.creditorSummary.firstName} ${debt.creditorSummary.lastName}`;
        }
    } else {
        userLabel = "Usuario";
        userName = debt.targetUserName ?? "";
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Deuda por {mode === "receivable" ? "cobrar" : "pagar"}</Text>
                    <CloseButton style={styles.closeButton} />
                </View>

                <DebtInfo
                    concept={concept}
                    description={description}
                    amount={amount}
                />

                <Text style={styles.sectionTitle}>{userLabel}</Text>
                <View style={styles.inputBox}>
                    <Text style={styles.inputText}>{userName}</Text>
                </View>

                <Text style={styles.sectionTitle}>Estatus</Text>
                <View style={styles.inputBox}>
                    <Text style={styles.inputText}>{DebtStatusText[status] ?? status}</Text>
                </View>

                <View style={{ height: 12 }} />

                {isAcceptedPayable && (
                    <Button
                        title="Marcar como pagada"
                        onPress={() => reportPayment(debt, setDebt, router)}
                        style={styles.payButton}
                    />
                )}

                {isPendingConfirmationReceivable && (
                    <View>
                        <Button
                            title="Confirmar pago"
                            onPress={() => verifyPayment(debt, setDebt, router)}
                            style={styles.payButton}
                        />
                        <Button
                            title="Rechazar pago"
                            onPress={() => rejectPayment(debt, setDebt, router)}
                            style={[styles.payButton, { backgroundColor: "#f8653c", marginTop: 8 }]}
                        />
                    </View>
                )}

                {isEditable && (
                    <Button
                        title="Editar deuda"
                        onPress={() => {
                            if (!debt.id) {
                                console.log("ERROR: debt.id is undefined", debt);
                                return;
                            }
                            router.push({
                                pathname: "editDebt",
                                params: { id: debt.id, type, mode }
                            });
                        }}
                        style={[styles.payButton, { backgroundColor: "#555" }]}
                    />
                )}

                {isQuickEditable && (
                    <Button
                        title="Editar deuda"
                        onPress={() => {
                            router.push({
                                pathname: "editDebt",
                                params: { id: debt.id, type, mode }
                            });
                        }}
                        style={[styles.payButton, { backgroundColor: "#555" }]}
                    />
                )}
                {isQuickPending && (
                    <Button
                        title={mode === "receivable" ? "Marcar como saldada" : "Marcar como pagada"}
                        onPress={() => quickConfirm(debt, setDebt, router)}
                        style={styles.payButton}
                    />
                )}
                {isRejectedPayable && (
                    <Button
                        title={mode === "payable" ? "Marcar como saldada" : "Marcar como pagada"}
                        onPress={() => reportPayment(debt, setDebt, router)}
                        style={styles.payButton}
                    />
                )}
                {isResendable && (
                    <Button
                        title="Reenviar deuda"
                        onPress={() => resendDebt(debt, setDebt, router)}
                        style={styles.payButton}
                    />
                )}
                {isDeletable && (
                    <Button
                        title="Eliminar deuda"
                        onPress={() => {
                            if (type === "quick") {
                                deleteDebtQuick(debt, setDebt, router);
                            } else {
                                verifyPayment(debt, setDebt, router);
                            }
                        }}
                        style={styles.deleteButton}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#6C1ED6",
    },
    closeButton: {
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 8,
        color: "#333",
    },
    inputBox: {
        backgroundColor: "#F5F5F7",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    inputText: {
        fontSize: 16,
        color: "#333",
    },
    payButton: {
        marginTop: 24,
        backgroundColor: "#6C1ED6",
    },
    deleteButton: {
        marginTop: 24,
        backgroundColor: "#fa3232ff",
    },
});