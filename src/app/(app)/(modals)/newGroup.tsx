import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Alert, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import CloseButton from "@/components/CloseButton";
import { Button } from "@/components/Button";
import { createGroup } from "@/services/groupService";
import friendService from "@/services/friendService";
import { Friend } from "@/types/Friends";

export default function NewGroupScreen() {
    const router = useRouter();

    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
    const [memberName, setMemberName] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);
    const [loadingFriends, setLoadingFriends] = useState(false);

    useEffect(() => {
        setLoadingFriends(true);
        friendService.getAll(50, null)
            .then((result) => setAvailableFriends(result.items))
            .catch(() => setAvailableFriends([]))
            .finally(() => setLoadingFriends(false));
    }, []);

    const filteredFriends = availableFriends.filter(
        (friend) =>
            `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(memberName.toLowerCase()) &&
            !members.some(m => m.id === friend.id)
    );

    const addMember = (friend: Friend) => {
        if (!members.some(m => m.id === friend.id)) {
            setMembers([...members, { id: friend.id, name: `${friend.firstName} ${friend.lastName}` }]);
        }
        setMemberName("");
        setShowSuggestions(false);
    };

    const handleCreateGroup = async () => {
        try {
            const memberIds = members.map(m => m.id);
			console.log("Creating group with:", groupName, description, memberIds);
            await createGroup(groupName, description, memberIds);
            router.back();
        } catch (error) {
            Alert.alert("Error", "No se pudo crear el grupo.");
        }
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
                {loadingFriends && (
                    <ActivityIndicator style={{ marginTop: 8 }} color="#6C1ED6" />
                )}
                {showSuggestions && filteredFriends.length > 0 && (
                    <View style={styles.suggestionsBox}>
                        {filteredFriends.map((friend) => (
                            <Pressable
                                key={friend.id}
                                style={styles.suggestionItem}
                                onPress={() => addMember(friend)}
                            >
                                <Text style={styles.suggestionText}>
                                    {friend.firstName} {friend.lastName}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            <Text style={styles.subTitle}>Integrantes ({members.length})</Text>
            <FlatList
                data={members}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: 10 }}
                renderItem={({ item }) => (
                    <View style={styles.memberRow}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {item.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.memberName}>{item.name}</Text>
                    </View>
                )}
            />

            <Button
                title={"Crear grupo"}
                style={styles.loginButton}
                textStyle={styles.loginButtonText}
                onPress={handleCreateGroup}
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