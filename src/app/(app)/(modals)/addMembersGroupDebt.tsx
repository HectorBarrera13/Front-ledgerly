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

	const [selected, setSelected] = useState<string[]>([]);
	const [equalParts, setEqualParts] = useState(true);
	const [memberName, setMemberName] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	const filteredFriends = availableMembers.filter(
		(friend) => friend.toLowerCase().includes(memberName.toLowerCase()) && !selected.includes(friend)
	);

	const addMember = (name: string) => {
		if (!selected.includes(name)) setSelected((prev) => [...prev, name]);
		setMemberName("");
		setShowSuggestions(false);
	};

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
					amount={Number.parseFloat(String(amount)) || 0}
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
					{selected.map((m) => (
						<View key={m} style={styles.memberRow}>
							<Text style={styles.memberDot}>•</Text>
							<Text style={styles.memberText}>{m}</Text>
						</View>
					))}
				</View>

				<View style={styles.checkboxRow}>
					<Pressable onPress={() => setEqualParts((s) => !s)} style={styles.checkbox}>
						{equalParts && <View style={styles.checkboxInner} />}
					</Pressable>
					<Text style={{ marginLeft: 8 }}>Partes iguales</Text>
				</View>

				<Button
					title="Asignar montos"
					onPress={() =>
                        //esto lo hizo el primo, no estoy segura si está bien, pero confío en ti javisoftware :) JASJDAJSDJ
						router.push(
							`/(modals)/addAmountGroupDebt?members=${encodeURIComponent(selected.join("|"))}&amount=${encodeURIComponent(amount)}`
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
	checkboxRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginTop: 8, 
        marginBottom: 20,
        marginHorizontal: 10,
    },
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 1,
		borderColor: "#CFCFCF",
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxInner: { 
        width: 12, 
        height: 12, 
        backgroundColor: "#6C1ED6", 
        borderRadius: 2 
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
});

