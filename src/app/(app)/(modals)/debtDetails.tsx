import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import DebtInfo from "@/components/debts/DebtInfo";
import {Button} from "@/components/Button";
import CloseButton from "@/components/CloseButton";
import debtService from "@/services/debtService";
import { DebtStatusText } from "@/types/Debt";

export default function DebtDetailScreen() {
    const { id, mode, type } = useLocalSearchParams();
    const router = useRouter();
    const [debt, setDebt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebt = async () => {
            setLoading(true);
            try {
                let result;
                if (type === "betweenUsers") {
                    result = await debtService.fetchDebtsBetweenUsersById(id as string);
                } else {
                    result = await debtService.fetchQuickDebtById(id as string);
                }
                setDebt(result);
            } catch (error) {
                setDebt(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDebt();
    }, [id, type]);

    const handleReportPayment = async () => {
        await debtService.reportDebtPayment(debt.id);
        setDebt({ ...debt, status: "PAYMENT_CONFIRMATION_PENDING" });
        router.push(`(modals)/successNotification?title=¡Listo!&message=Hemos notificado al acreedor`);
    };

    const handleVerifyPayment = async () => {
        await debtService.verifyDebtPayment(debt.id);
        setDebt({ ...debt, status: "PAYMENT_CONFIRMED" });
        router.push(`(modals)/successNotification?title=¡Pago confirmado!&message=La deuda ha sido saldada`);
    };

    const handleRejectPayment = async () => {
        await debtService.rejectDebtPayment(debt.id);
        setDebt({ ...debt, status: "PAYMENT_CONFIRMATION_REJECTED" });
        router.push(`(modals)/successNotification?title=Pago rechazado&message=El pago fue rechazado`);
    };

    const handleQuickConfirm = async () => {
        await debtService.verifyDebtPayment(debt.id);
        setDebt({ ...debt, status: "PAYMENT_CONFIRMED" });
        router.push(`(modals)/successNotification?title=¡Listo!&message=La deuda ha sido saldada`);
    };

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

    const finalMode = mode || "";

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Deuda por {finalMode === "receivable" ? "cobrar" : "pagar"}</Text>
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

                {/* Deudor: deuda entre personas, status ACCEPTED */}
                {type === "betweenUsers" && finalMode === "payable" && status === "ACCEPTED" && (
                    <Button
                        title="Marcar como pagada"
                        onPress={handleReportPayment}
                        style={styles.payButton}
                    />
                )}

                {/* Acreedor: deuda entre personas, status PAYMENT_CONFIRMATION_PENDING */}
                {type === "betweenUsers" && finalMode === "receivable" && status === "PAYMENT_CONFIRMATION_PENDING" && (
                    <View>
                        <Button
                            title="Confirmar pago"
                            onPress={handleVerifyPayment}
                            style={styles.payButton}
                        />
                        <Button
                            title="Rechazar pago"
                            onPress={handleRejectPayment}
                            style={[styles.payButton, { backgroundColor: "#f8653c", marginTop: 8 }]}
                        />
                    </View>
                )}

                {(status === "PENDING" || status === "REJECTED") && (
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

                {/* Deuda rápida: botón para marcar como pagada/saldada, cambia directo a confirmado */}
                {type === "quick" && (finalMode === "payable" || finalMode === "receivable") && status !== "PAYMENT_CONFIRMED" && (
                    <Button
                        title={finalMode === "receivable" ? "Marcar como saldada" : "Marcar como pagada"}
                        onPress={handleQuickConfirm}
                        style={styles.payButton}
                    />
                )}

                {/* Mensaje informativo si el pago fue confirmado o rechazado */}
                {status === "PAYMENT_CONFIRMED" && (
                    <Text style={{ color: "#0ac78e", marginTop: 24, fontWeight: "bold" }}>
                        Pago confirmado
                    </Text>
                )}
                {status === "PAYMENT_CONFIRMATION_REJECTED" && (
                    <Text style={{ color: "#f8653c", marginTop: 24, fontWeight: "bold" }}>
                        Pago rechazado
                    </Text>
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
});