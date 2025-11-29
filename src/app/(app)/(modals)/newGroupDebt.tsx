import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import CloseButton from "@/components/CloseButton";

export default function NewGroupDebtScreen() {
	const router = useRouter();
	const [concept, setConcept] = useState("");
	const [amount, setAmount] = useState("");
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

				<Input label="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" />

				<Input label="Descripción" value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textarea} />

				<Button
					title="Continuar"
					onPress={() =>
						router.push(
							`/(modals)/addMembersGroupDebt?concept=${encodeURIComponent(concept)}&amount=${encodeURIComponent(amount)}`
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
});

