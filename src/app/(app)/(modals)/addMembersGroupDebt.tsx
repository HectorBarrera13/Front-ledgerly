import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/Button";
import CloseButton from "@/components/CloseButton";
import DebtInfo from "@/components/debts/DebtInfo";

const sampleMembers = ["Integrante 1", "Integrante 2", "Integrante 3"];

export default function AddMembersGroupDebt() {
	const params = useLocalSearchParams();
	const concept = Array.isArray(params.concept) ? params.concept[0] : params.concept ?? "";
	const amount = Array.isArray(params.amount) ? params.amount[0] : params.amount ?? "0";
	const router = useRouter();

	const rawGroupMembers = Array.isArray(params.groupMembers) ? params.groupMembers[0] : params.groupMembers;
	const availableMembers = rawGroupMembers ? String(rawGroupMembers).split("|") : sampleMembers;

	const splitParam = Array.isArray(params.split) ? params.split[0] : params.split ?? "";
	const initialEqual = splitParam === "equal";
	const [selected, setSelected] = useState<string[]>(() => [...availableMembers]);
	const [equalParts] = useState(initialEqual);

	const total = Number.parseFloat(String(amount)) || 0;
	const [amountsPer, setAmountsPer] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		if (initialEqual && availableMembers.length) {
			const per = (total / availableMembers.length).toFixed(2);
			for (const m of availableMembers) initial[m] = per;
		} else {
			for (const m of availableMembers) initial[m] = "";
		}
		return initial;
	});

	const [memberName, setMemberName] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	const filteredFriends = availableMembers.filter(
		(friend) => friend.toLowerCase().includes(memberName.toLowerCase()) && !selected.includes(friend)
	);

	const addMember = (name: string) => {
		if (!selected.includes(name)) setSelected((prev) => [...prev, name]);
		setMemberName("");
		setShowSuggestions(false);
		if (equalParts) {
			const newCount = selected.length + 1;
			const per = (total / newCount).toFixed(2);
			const next: Record<string, string> = {};
			for (const m of [...selected, name]) next[m] = per;
			setAmountsPer(next);
		}
	};

	const removeMember = (name: string) => {
		setSelected((prev) => prev.filter((x) => x !== name));
	};

	React.useEffect(() => {
		if (equalParts) {
			const per = selected.length ? (total / selected.length).toFixed(2) : "0.00";
			const next: Record<string, string> = {};
			for (const m of selected) next[m] = per;
			setAmountsPer(next);
		} else {
			const next: Record<string, string> = {};
			for (const m of selected) next[m] = amountsPer[m] ?? "";
			setAmountsPer(next);
		}
	}, [selected.length, equalParts, total]);

	const [dynamicAmounts, setDynamicAmounts] = useState(0);

	React.useEffect(() => {
		const totalAmount = Object.values(amountsPer).map((v) => Number.parseFloat(v) || 0).reduce((a, b) => a + b, 0);
		setDynamicAmounts(totalAmount);
	}, [amountsPer]);

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<Stack.Screen options={{ headerShown: false }} />

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>Nueva deuda</Text>
					<CloseButton />
				</View>

				<DebtInfo
					concept={String(concept ?? "")}
					description={""}
					amount={dynamicAmounts}
				/>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Añadir integrante</Text>

					<View style={styles.row}>
						<TextInput
							style={[styles.input, { flex: 1 }]}
							placeholder="Escribe un nombre"
							value={memberName}
							onChangeText={(text) => {
								setMemberName(text);
								setShowSuggestions(text.length > 0);
							}}
						/>

						<Pressable
							style={styles.plusButton}
							onPress={() => setShowSuggestions((s) => !s)}
						>
							<Text style={styles.plusText}>+</Text>
						</Pressable>
					</View>

					{showSuggestions && filteredFriends.length > 0 && (
						<View style={styles.suggestionsBox}>
							{filteredFriends.map((friend) => (
								<Pressable
									key={friend}
									style={styles.suggestionItem}
									onPress={() => addMember(friend)}
								>
									<Text style={styles.suggestionText}>{friend}</Text>
								</Pressable>
							))}
						</View>
					)}
					
				</View>

				<View style={styles.membersBox}>
					<Text style={styles.label}>Integrantes de la deuda</Text>
					{selected.map((m) => (
						<View key={m} style={[styles.memberRow, { justifyContent: 'space-between' }] }>
							<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
								<Text style={styles.memberDot}>•</Text>
								<Text style={[styles.memberText, { flex: 1 }]}>{m}</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<TextInput
									style={styles.amountInput}
									value={amountsPer[m] ?? ""}
									onChangeText={(v) => setAmountsPer((p) => ({ ...p, [m]: v }))}
									keyboardType="numeric"
									editable={!equalParts}
									placeholder="$0.00"
								/>
								<Pressable onPress={() => removeMember(m)} style={{ marginLeft: 12 }}>
									<Text style={{ color: '#d00', fontWeight: '700' }}>✕</Text>
								</Pressable>
							</View>
						</View>
					))}
				</View>

				<Button
					title="Finalizar deuda"
					onPress={() =>
                        //esto lo hizo el primo, no estoy segura si está bien, pero confío en ti javisoftware :) JASJDAJSDJ
						router.push(
							`/(modals)/successNotification?type=groupDebt&concept=${encodeURIComponent(concept)}&amount=${encodeURIComponent(
								amount
							)}&groupMembers=${encodeURIComponent(selected.join("|"))}&amountsPer=${encodeURIComponent(
								selected.map((m) => `${m}:${amountsPer[m] || "0"}`).join("|")
								//lo del title es para que en la pantalla de éxito salga el "Deuda creada con éxito" 
								//eso sí está correcto javisotftware
							)}&title=${encodeURIComponent("Deuda creada con éxito")}`
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
        paddingBottom: 120 
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
	topCard: {
		backgroundColor: "#6C1ED6",
		borderRadius: 12,
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	cardTitle: { 
        color: "#fff", 
        fontWeight: "700", 
        fontSize: 16 
    },
	cardSubtitle: { 
        color: "#ffdfff", 
        fontSize: 12 
    },
	cardAmount: { 
        color: "#fff", 
        fontWeight: "700", 
        fontSize: 16 
    },
	sectionTitle: { 
        color: "#6C1ED6", 
        fontWeight: "700", 
        marginBottom: 12 
    },
	selectorRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 12 
    },
	selectorPlaceholder: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#DCDCDC",
	},
	addBtn: {
		marginLeft: 8,
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#6C1ED6",
		justifyContent: "center",
		alignItems: "center",
	},
	addBtnText: { 
        color: "#fff", 
        fontSize: 20, 
        fontWeight: "700" 
    },
	membersBox: { 
        backgroundColor: "#E9E9E9", 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 16,
        marginHorizontal: 10
    },
	memberRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 8 
    },
	memberDot: { 
        color: "#6C1ED6", 
        marginRight: 8 
    },
	memberText: { 
        color: "#333" 
    },
	continueBtn: { 
        marginTop: 24, 
        width: "100%", 
        height: 56, 
        borderRadius: 32, 
        backgroundColor: "#6C1ED6" 
    },
	inputContainer: { 
        marginBottom: 24, 
        marginHorizontal: 10,
        marginTop: 14,
    },
	label: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#6C1ED6", 
        marginBottom: 6 
    },
	input: {
		borderWidth: 1,
		borderColor: "#6C1ED6",
		borderRadius: 12,
		padding: 12,
        paddingLeft: 12,
		fontSize: 16,
		backgroundColor: "#f8f8f8ff",
	},
	row: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
	plusButton: {
		width: 42,
		height: 42,
		borderRadius: 21,
		backgroundColor: "#6C1ED6",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 10,
	},
	plusText: { 
        color: "#FFFFFF", 
        fontSize: 28, 
        fontWeight: "700", 
        lineHeight: 30 
    },
	suggestionsBox: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		marginTop: 6,
		overflow: "hidden",
		elevation: 3,
	},
	suggestionItem: { 
        paddingVertical: 10, 
        paddingHorizontal: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: "#eee"
    },
	suggestionText: { 
        fontSize: 16, 
        color: "#333" 
    },
	amountInput: {
		width: 100,
		height: 40,
		borderWidth: 1,
		borderColor: "#DCDCDC",
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
		textAlign: 'right'
	},
});

