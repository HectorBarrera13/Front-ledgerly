import React, { useState } from "react";
import { View, StyleSheet, RefreshControl, FlatList, Text, TouchableOpacity } from "react-native";
import ButtonAdd from "@/components/ButtonAdd";
import { useRouter } from "expo-router";
import { useDebts } from "@/hooks/useDebts";
import CardDebt from "@/components/debts/debtCard";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

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

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            PENDING: "Pendiente",
            ACCEPTED: "Aceptada",
            REJECTED: "Rechazada",
            PAYMENT_CONFIRMATION_PENDING: "Pago pendiente",
            PAYMENT_CONFIRMATION_REJECTED: "Pago rechazado",
        };
        return statusMap[status] || status;
    };

    const generatePDF = async () => {
        try {
            const total = mappedDebts.reduce((sum, debt) => sum + debt.amount, 0);
            
            const debtsHTML = mappedDebts.map(debt => `
                <tr>
                    <td>${debt.title}</td>
                    <td>${debt.creditor}</td>
                    <td>${getStatusText(debt.status)}</td>
                    <td class="text-right">$${debt.amount.toFixed(2)}</td>
                </tr>
            `).join("");

            const html = `
                <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                padding: 20px;
                                color: #333;
                            }

                            h1 {
                                color: #7519EB;
                                border-bottom: 3px solid #7519EB;
                                padding-bottom: 10px;
                                margin-bottom: 20px;
                            }

                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                            }

                            th {
                                background-color: #7519EB;
                                color: white;
                                padding: 12px;
                                text-align: left;
                            }

                            td {
                                padding: 12px;
                                border-bottom: 1px solid #e0e0e0;
                            }

                            .text-right {
                                text-align: right;
                            }

                            .total {
                                margin-top: 20px;
                                text-align: right;
                                font-size: 18px;
                                font-weight: bold;
                                color: #7519EB;
                            }

                            .date {
                                color: #666;
                                font-size: 12px;
                                margin-bottom: 20px;
                            }

                            @media print {
                                @page {
                                    margin: 20px;
                                    size: A4;
                                }

                                body {
                                    -webkit-print-color-adjust: exact;
                                    print-color-adjust: exact;
                                }

                                h1, .date {
                                    page-break-after: avoid;
                                }

                                table {
                                    page-break-inside: auto;
                                }

                                tr {
                                    page-break-inside: avoid;
                                    page-break-after: auto;
                                }

                                thead {
                                    display: table-header-group;
                                }

                                .total {
                                    page-break-inside: avoid;
                                }

                                body {
                                    font-size: 12pt;
                                }

                                h1 {
                                    font-size: 18pt;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Deudas por Pagar - Ledgerly</h1>
                        <p class="date">Generado el: ${new Date().toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th>Acreedor</th>
                                    <th>Estado</th>
                                    <th class="text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${debtsHTML}
                            </tbody>
                        </table>
                        <div class="total">
                            Total: $${total.toFixed(2)}
                        </div>
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html });
            
            await Sharing.shareAsync(uri, {
                mimeType: "application/pdf",
                dialogTitle: "Compartir reporte de deudas",
                UTI: "com.adobe.pdf"
            });
        } catch (error) {
            console.error("Error al generar PDF:", error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <TouchableOpacity 
                onPress={generatePDF}
                style={styles.printButton}
            >
                <Ionicons name="print-outline" size={24} color="#7519EB" />
            </TouchableOpacity>

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
    printButton: {
        position: "absolute",
        bottom: 88,
        right: 31,
        zIndex: 1000,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});