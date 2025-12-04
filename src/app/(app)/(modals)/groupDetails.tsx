import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Pressable, Image } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import CardGroupDebt from "@/components/groups/CardGroupDebt";
import ButtonAdd from "@/components/ButtonAdd";
import CloseButton from "@/components/CloseButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGroupDetails } from "@/hooks/useGroupDetails";
import AvatarInitials from "@/components/AvatarInitials";

export default function GroupDetailsScreen() {
    const router = useRouter();
    const { id: groupId } = useLocalSearchParams<{ id: string }>();
    const [role, setRole] = useState<"CREDITOR" | "DEBTOR">("DEBTOR");

    const debtsPending = useGroupDetails(groupId ?? "", role, "PENDING");
    const debtsAccepted = useGroupDetails(groupId ?? "", role, "ACCEPTED");
    const debtsRejected = useGroupDetails(groupId ?? "", role, "REJECTED");
    const debtsPaymentPending = useGroupDetails(groupId ?? "", role, "PAYMENT_CONFIRMATION_PENDING");
    const debtsPaymentRejected = useGroupDetails(groupId ?? "", role, "PAYMENT_CONFIRMATION_REJECTED");

    const mappedDebts = [
        ...(
            role === "DEBTOR"
                ? debtsPending.debts.filter((debt: any) => debt.status !== "PENDING")
                : debtsPending.debts
        ).map((debt: any) => ({
            ...debt,
            status: debt.status ?? "PENDING",
        })),
        ...debtsAccepted.debts.map((debt: any) => ({
            ...debt,
            status: debt.status ?? "ACCEPTED",
        })),
        ...debtsRejected.debts.map((debt: any) => ({
            ...debt,
            status: debt.status ?? "REJECTED",
        })),
        ...debtsPaymentPending.debts.map((debt: any) => ({
            ...debt,
            status: debt.status ?? "PAYMENT_CONFIRMATION_PENDING",
        })),
        ...debtsPaymentRejected.debts.map((debt: any) => ({
            ...debt,
            status: debt.status ?? "PAYMENT_CONFIRMATION_REJECTED",
        })),
    ];

    const loading =
        debtsPending.loading ||
        debtsAccepted.loading ||
        debtsRejected.loading ||
        debtsPaymentPending.loading ||
        debtsPaymentRejected.loading;

    const group = debtsPending.group || debtsAccepted.group || debtsRejected.group || debtsPaymentPending.group || debtsPaymentRejected.group;
    const members = debtsPending.members || [];

    const refresh = () => {
        debtsPending.refreshDebts();
        debtsAccepted.refreshDebts();
        debtsRejected.refreshDebts();
        debtsPaymentPending.refreshDebts();
        debtsPaymentRejected.refreshDebts();
    };

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    if (!group) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No se encontró el grupo.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
                <Stack.Screen options={{ headerShown: false }} />
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#6C1ED6"]}
                        />
                    }
                >
                    <View style={styles.headerContent}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>{group.name}</Text>
                            <CloseButton style={styles.closeButton} />
                        </View>

                        <Text style={styles.sectionTitle}>Descripción del grupo</Text>
                        <View style={styles.descriptionBox}>
                            <Text style={styles.descriptionText}>{group.description}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Integrantes del grupo</Text>
                        <View style={styles.membersRow}>
                            {members.map((member) => (
                                <View key={member.id} style={styles.memberContainer}>
                                    {member.picture ? (
                                        <Image
                                            source={{ uri: member.picture }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                        <AvatarInitials
                                            firstName={member.firstName}
                                            lastName={member.lastName}
                                            size={40}
                                        />
                                    )}
                                </View>
                            ))}
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.roleButtonsRow}>
                            <Pressable
                                style={[
                                    styles.roleButton,
                                    role === "DEBTOR" && styles.roleButtonActive,
                                ]}
                                onPress={() => setRole("DEBTOR")}
                            >
                                <Text
                                    style={[
                                        styles.roleButtonText,
                                        role === "DEBTOR" && styles.roleButtonTextActive,
                                    ]}
                                >
                                    Por pagar
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.roleButton,
                                    role === "CREDITOR" && styles.roleButtonActive,
                                ]}
                                onPress={() => setRole("CREDITOR")}
                            >
                                <Text
                                    style={[
                                        styles.roleButtonText,
                                        role === "CREDITOR" && styles.roleButtonTextActive,
                                    ]}
                                >
                                    Por cobrar
                                </Text>
                            </Pressable>
                        </View>

                        {loading && !refreshing ? (
                            <ActivityIndicator size="large" color="#6C1ED6" style={{ marginTop: 24 }} />
                        ) : mappedDebts.length === 0 ? (
                            <Text style={styles.emptyText}>No hay deudas para este filtro.</Text>
                        ) : (
                            mappedDebts.map((debt) => (
                                <CardGroupDebt
                                    key={debt.id}
                                    debt={debt}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(modals)/debtDetails",
                                            params: {
                                                id: debt.id,
                                                type: "betweenUsers"
                                            }
                                        })
                                    }
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
                <View style={styles.addBtnContainer}>
                    <ButtonAdd
                        onPress={() =>
                            router.push({
                                pathname: "/(modals)/newGroupDebt",
                                params: { groupId }
                            })
                        }
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContent: {
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        marginTop: 18,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#6C1ED6",
    },
    closeButton: {
        marginLeft: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#3b3b3b",
        marginBottom: 12,
    },
    totalAmount: {
        fontSize: 22,
        fontWeight: "700",
        color: "#3b3b3b",
    },
    descriptionBox: {
        backgroundColor: "#E0E0E0",
        padding: 14,
        borderRadius: 12,
        marginBottom: 24,
    },
    descriptionText: {
        fontSize: 15,
        color: "#444",
        lineHeight: 20,
    },
    membersRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dcdcdc",
        padding: 12,
        borderRadius: 16,
        marginBottom: 24,
    },
    memberContainer: {
        marginRight: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#9e60ed",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    avatarText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    addMemberButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#B5B5B5",
        justifyContent: "center",
        alignItems: "center",
    },
    addMemberText: {
        fontSize: 30,
        color: "#fff",
        fontWeight: "700",
        marginTop: -4,
    },
    separator: {
        height: 1,
        backgroundColor: "#CFCFCF",
        marginBottom: 24,
        marginTop: 4,
    },
    roleButtonsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        gap: 12,
    },
    roleButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: "#e0e0e0",
        marginHorizontal: 6,
    },
    roleButtonActive: {
        backgroundColor: "#6C1ED6",
    },
    roleButtonText: {
        color: "#6C1ED6",
        fontWeight: "700",
        fontSize: 16,
    },
    roleButtonTextActive: {
        color: "#fff",
    },
    addBtnContainer: {
        position: "absolute",
        bottom: 24,
        right: 24,
    },
    emptyText: {
        textAlign: "center",
        color: "#888",
        marginTop: 32,
    },
});