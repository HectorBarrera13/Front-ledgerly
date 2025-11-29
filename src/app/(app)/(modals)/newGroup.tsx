import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { useRouter, Stack } from "expo-router";
import CloseButton from "@/components/CloseButton";
import { Button } from "@/components/Button";

export default function NewGroupScreen() {
	const router = useRouter();

	const [groupName, setGroupName] = useState("");
	const [description, setDescription] = useState("");

	// Simulación de amigos existentes
	const availableFriends = [
		"Ana López",
		"Daniel Martínez",
		"Carla Ruiz",
		"Fernando Torres",
		"Valeria Navarro",
		"José Hernández",
        "María García",
        "Luis Pérez",
        "Sofía Sánchez",
        "Miguel Ramírez",
	];

	const [members, setMembers] = useState<string[]>([]);
	const [memberName, setMemberName] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	// Filtrar sugerencias
	const filteredFriends = availableFriends.filter(
		(friend) =>
			friend.toLowerCase().includes(memberName.toLowerCase()) &&
			!members.includes(friend)
	);

	const getInitials = (fullName: string) => {
		const parts = fullName.trim().split(" ");
		if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

		return (
			parts[0].charAt(0).toUpperCase() +
			parts[parts.length - 1].charAt(0).toUpperCase()
		);
	};

	const addMember = (name: string) => {
		if (!members.includes(name)) {
			setMembers([...members, name]);
		}
		setMemberName("");
		setShowSuggestions(false);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerShown: false }} />
			<View style={styles.header}>
                <Text style={styles.headerTitle}>Crear nuevo grupo</Text>
                <CloseButton style={styles.closeButton} />
            </View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Nombre del grupo</Text>
				<TextInput
					style={styles.input}
					placeholder="Ej. Viaje a Cancún"
					value={groupName}
					onChangeText={setGroupName}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Descripción</Text>
				<TextInput
					style={styles.input}
					placeholder="Ej. Gastos del viaje"
					value={description}
					onChangeText={setDescription}
				/>
			</View>

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
						onPress={() => setShowSuggestions(!showSuggestions)}
					>
						<Text style={styles.plusText}>+</Text>
					</Pressable>
				</View>

				{/*  Para que filtre a los amigos mientras escribes */}
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

			<Text style={styles.subTitle}>Integrantes ({members.length})</Text>
			<FlatList
				data={members}
				keyExtractor={(item, index) => index.toString()}
				contentContainerStyle={{ paddingVertical: 10 }}
				renderItem={({ item }) => (
					<View style={styles.memberRow}>
						<View style={styles.avatarContainer}>
							<Text style={styles.avatarText}>{getInitials(item)}</Text>
						</View>
						<Text style={styles.memberName}>{item}</Text>
					</View>
				)}
			/>

			<Button
				title={"Crear grupo"}
				style={styles.loginButton}
				textStyle={styles.loginButtonText}
				onPress={() => {
					router.back();
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
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
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: "#FFFFFF",
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: "#6C1ED6",
		marginBottom: 24,
	},
	inputContainer: {
		marginBottom: 18,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#6C1ED6",
		marginBottom: 6,
	},
	input: {
		borderWidth: 1,
		borderColor: "#6C1ED6",
		borderRadius: 12,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#f8f8f8ff",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
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
		lineHeight: 30,
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
		borderBottomColor: "#eee",
	},
	suggestionText: {
		fontSize: 16,
		color: "#333",
	},
	subTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#6C1ED6",
		marginTop: 10,
		marginBottom: 6,
	},
	memberRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	avatarContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#9e60ed",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	avatarText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "700",
	},
	memberName: {
		fontSize: 16,
		color: "#333",
		fontWeight: "500",
	},
    loginButton: {
        backgroundColor: "#7B1FFF",
        borderRadius: 30,
        width: "100%",
        marginTop: 10,
        marginBottom: 20,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "InstumentSans-Bold",
    },
});
