import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter, Stack } from "expo-router";
import CardDebt from "@/components/debts/debtCard";
import ButtonAdd from "@/components/ButtonAdd";
import CloseButton from "@/components/CloseButton";

// datos falsos simulando grupos 
const fakeGroup = {
	name: "Viaje a Cancún",
	description:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non luctus lorem, at egestas felis.",
	members: [
		"Ana López",
		"Daniel Martínez",
		"Carla Ruiz",
		"Fernando Torres",
		"Valeria Navarro",
	],
};

const fakeDebts = [
    {
        id: "1",
        title: "Comida",
        concept: "Comida",
        amount: 1234.5,
        debtor: "Usuario1",
        creditor: "Usuario2",
    },
    {
        id: "2",
        title: "Hotel",
        concept: "Hotel",
        amount: 820.0,
        debtor: "Usuario3",
        creditor: "Usuario1",
    },
    {
        id: "3",
        title: "Transporte",
        concept: "Transporte",
        amount: 450.75,
        debtor: "Usuario2",
        creditor: "Usuario3",
    },
];

export default function GroupDetailsScreen() {
	const router = useRouter();

	const getInitials = (fullName: string) => {
		const parts = fullName.trim().split(" ");
		if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
		return (
			parts[0].charAt(0).toUpperCase() +
			parts[parts.length - 1].charAt(0).toUpperCase()
		);
	};

	return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.headerContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{fakeGroup.name}</Text>
                        <CloseButton style={styles.closeButton} />
                    </View>

                    <Text style={styles.sectionTitle}>Descripción del grupo</Text>

                    <View style={styles.descriptionBox}>
                        <Text style={styles.descriptionText}>{fakeGroup.description}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Integrantes del grupo</Text>

                    <View style={styles.membersRow}>
                        {fakeGroup.members.map((member, idx) => (
                            <View key={member} style={styles.avatar}>
                                <Text style={styles.avatarText}>{getInitials(member)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.separator} />

                    {fakeDebts.map((debt) => (
                        <CardDebt
                            key={debt.id}
                            debt={debt}
                            onPress={(id) => router.push(`/(modals)/debtDetails?id=${id}&mode=payable&type=betweenUsers`)}
                            onSettle={(id) => console.log("settle", id)}
                        />
                    ))}
                </View>
            </ScrollView>

            <View style={styles.addBtnContainer}>
                <ButtonAdd onPress={() => router.push("/(modals)/newGroupDebt")} />
            </View>
        </View>
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