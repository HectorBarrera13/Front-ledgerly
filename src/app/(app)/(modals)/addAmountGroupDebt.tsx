import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/Button";
import CloseButton from "@/components/CloseButton";

export default function AddAmountGroupDebt() {
	const params = useLocalSearchParams();
	const router = useRouter();
	const membersParam = Array.isArray(params.members) ? params.members[0] : params.members ?? "";
	const amountParam = Array.isArray(params.amount) ? params.amount[0] : params.amount ?? "0";

	const members = membersParam ? membersParam.split("|") : [];
	const total = Number.parseFloat(String(amountParam)) || 0;

	const defaultPer = useMemo(() => (members.length ? (total / members.length).toFixed(2) : "0.00"), [members, total]);

	const [amounts, setAmounts] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		for (const m of members) initial[m] = defaultPer;
		return initial;
	});

	const onChange = (member: string, value: string) => {
		setAmounts((prev) => ({ ...prev, [member]: value }));
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<Stack.Screen options={{ headerShown: false }} />

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>Nueva deuda</Text>
					<CloseButton />
				</View>

				<Text style={styles.sectionTitle}>Integrantes</Text>

				{members.map((m) => (
					<View key={m} style={styles.row}>
						<Text style={styles.name}>{m}</Text>
						<TextInput
							value={amounts[m]}
							onChangeText={(v) => onChange(m, v)}
							keyboardType="numeric"
							style={styles.amountInput}
						/>
					</View>
				))}

				<View style={{ height: 100 }} />
			</ScrollView>

			<View style={styles.fixedButton}>
				<Button
					title="Continuar"
                    //lógica para que al dar click, lleve a la pantalla de éxito, tú le sabes javisoftware :)
					onPress={() => router.push(`/(modals)/successNotification`)}
					style={styles.continueBtn}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { 
        flex: 1, 
        backgroundColor: "#F5F5F5",
    },
	content: { 
        padding: 24, 
        paddingTop: 36, 
        paddingBottom: 140,
    },
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: "#555",
		textAlign: "center",
		flex: 1,
	},
	sectionTitle: { 
        color: "#6C1ED6", 
        fontWeight: "700", 
        fontSize: 24, 
        marginBottom: 12,
    },
	row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 18 
    },
	name: { 
        color: "#333",
        fontSize: 18,
    },
	amountInput: {
		width: 120,
		backgroundColor: "#fff",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: "#DCDCDC",
		textAlign: "right",
	},
	fixedButton: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 16,
		paddingHorizontal: 20,
	},
	continueBtn: { 
        marginBottom: 40,
        width: "100%", 
        height: 56, 
        borderRadius: 32, 
        backgroundColor: "#6C1ED6" 
    },
});

