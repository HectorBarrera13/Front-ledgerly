import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import CloseButton from "@/components/CloseButton";

export default function NewGroupDebtScreen() {
	const router = useRouter();
	const [concept, setConcept] = useState("");
	const [amount, setAmount] = useState("");
	const [splitMode, setSplitMode] = useState<"equal" | "unequal" | null>(null);

	const handleAmountChange = (text: string) => {

		let cleanedAmount = String(text).replace(/-/g, "").replace(/[^0-9.]/g, "");
		const parts = cleanedAmount.split('.');

		if (parts.length > 2) {
			cleanedAmount = parts[0] + '.' + parts.slice(1).join('');
		}

		if (cleanedAmount.startsWith('.')) {
			cleanedAmount = '0' + cleanedAmount;
		}

		setAmount(cleanedAmount);
	};
	const [description, setDescription] = useState("");

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<Stack.Screen options={{ headerShown: false }} />

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>Nueva deuda</Text>
					<CloseButton />
				</View>

				<Input label="Concepto" value={concept} onChangeText={setConcept} maxLength={60} />


				<Input label="Descripción" value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textarea} />

				<View style={styles.splitRow}>
					<Pressable
						style={[styles.splitBtn, splitMode === "equal" && styles.splitBtnActive]}
						onPress={() => setSplitMode("equal")}
					>
						<Text style={[styles.splitBtnText, splitMode === "equal" && styles.splitBtnTextActive]}>Partes iguales</Text>
					</Pressable>
					<Pressable
						style={[styles.splitBtn, splitMode === "unequal" && styles.splitBtnActive]}
						onPress={() => setSplitMode("unequal")}
					>
						<Text style={[styles.splitBtnText, splitMode === "unequal" && styles.splitBtnTextActive]}>Partes desiguales</Text>
					</Pressable>
				</View>

				{splitMode === "equal" && (
					<Input label="Monto" value={amount} onChangeText={handleAmountChange} keyboardType="numeric" />
				)}

				<Button
					title="Continuar"
					onPress={() =>
						router.push(
							`/(modals)/addMembersGroupDebt?concept=${encodeURIComponent(concept)}&amount=${encodeURIComponent(
								splitMode === "equal" ? amount : ""
							)}&split=${encodeURIComponent(splitMode ?? "")}`
						)
					}
					style={styles.continueBtn}
				/>
			</ScrollView>
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
		paddingBottom: 120,
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
	textarea: {
		height: 80,
		textAlignVertical: "top",
	},
	continueBtn: {
		marginTop: 24,
		width: "100%",
		height: 56,
		borderRadius: 32,
		backgroundColor: "#6C1ED6",
	},
	splitRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	splitBtn: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#DCDCDC",
		backgroundColor: "#fff",
		alignItems: "center",
		marginRight: 8,
	},
	splitBtnActive: {
		backgroundColor: "#6C1ED6",
		borderColor: "#6C1ED6",
	},
	splitBtnText: { 
		color: "#6C1ED6", 
		fontWeight: "700",
	},
	splitBtnTextActive: { 
		color: "#fff", 
		fontWeight: "700",
	},
});

