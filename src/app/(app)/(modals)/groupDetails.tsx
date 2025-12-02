import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
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
    const { group, members, debts, loading, refreshDebts } = useGroupDetails(groupId ?? "");
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshDebts();
        setRefreshing(false);
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#6C1ED6" />
            </SafeAreaView>
        );
    }

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
                                <AvatarInitials
                                    key={member.id}
                                    firstName={member.firstName}
                                    lastName={member.lastName}
                                    size={40}
                                    style={{ marginRight: 10 }}
                                />
                            ))}
                        </View>

                        <View style={styles.separator} />

                        {debts
                            .filter((debt) => debt.status !== "PAYMENT_CONFIRMED")
                            .map((debt) => (
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
                            ))}
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
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: "#A6A6A6",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    fabText: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "700",
        marginTop: -2,
    },
    addBtnContainer: {
        position: "absolute",
        bottom: 24,
        right: 24,
    },
});