import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import CloseButton from "@/components/CloseButton";
import { Button } from "@/components/Button";
import AvatarInitials from "@/components/AvatarInitials";
import friendService from "@/services/friendService";
import { addGroupMember } from "@/services/groupService";
import { Friend } from "@/types/Friends";

export default function AddGroupMemberScreen() {
    const router = useRouter();
    const { groupId } = useLocalSearchParams();

    const [memberName, setMemberName] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [adding, setAdding] = useState(false);

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
            !selectedIds.includes(friend.id)
    );

    const handleSelect = (friend: Friend) => {
        setSelectedIds((prev) => [...prev, friend.id]);
        setMemberName("");
        setShowSuggestions(false);
    };

    const handleRemove = (id: string) => {
        setSelectedIds((prev) => prev.filter((fid) => fid !== id));
    };

    const handleAddMembers = async () => {
        if (!selectedIds.length) return;
        setAdding(true);
        try {
            await addGroupMember(groupId as string, selectedIds);
            Alert.alert("Éxito", "Integrantes añadidos al grupo.");
            router.back();
        } catch (error) {
            Alert.alert("Error", "No se pudo añadir el/los integrante(s).");
        } finally {
            setAdding(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Añadir integrantes</Text>
                <CloseButton style={styles.closeButton} />
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
                        onPress={() => setShowSuggestions((s) => !s)}
                    >
                        <Text style={styles.plusText}>+</Text>
                    </Pressable>
                </View>
                {showSuggestions && filteredFriends.length > 0 && (
                    <View style={styles.suggestionsBox}>
                        {filteredFriends.map((friend) => (
                            <Pressable
                                key={friend.id}
                                style={styles.suggestionItem}
                                onPress={() => handleSelect(friend)}
                                disabled={adding}
                            >
                                <Text style={styles.suggestionText}>
                                    {friend.firstName} {friend.lastName}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.membersBox}>
                <Text style={styles.label}>Integrantes seleccionados</Text>
                {selectedIds.map((id) => {
                    const friend = availableFriends.find(f => f.id === id);
                    if (!friend) return null;
                    return (
                        <View key={id} style={[styles.memberRow, { justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <AvatarInitials
                                    firstName={friend.firstName}
                                    lastName={friend.lastName}
                                    size={32}
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={[styles.memberText, { flex: 1 }]}>{friend.firstName} {friend.lastName}</Text>
                            </View>
                            <Pressable onPress={() => handleRemove(id)} style={{ marginLeft: 12 }}>
                                <Text style={{ color: '#d00', fontWeight: '700' }}>✕</Text>
                            </Pressable>
                        </View>
                    );
                })}
            </View>

            <Button
                title={adding ? "Agregando..." : "Agregar al grupo"}
                onPress={handleAddMembers}
                disabled={adding || selectedIds.length === 0}
                style={[
                    { marginTop: 24 },
                    (adding || selectedIds.length === 0) && { backgroundColor: "#cccccc" }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#FFFFFF",
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
        borderBottomColor: "#eee",
    },
    suggestionText: {
        fontSize: 16,
        color: "#333",
    },
    membersBox: {
        backgroundColor: "#E9E9E9",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        marginHorizontal: 10,
    },
    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    memberDot: { color: "#6C1ED6", marginRight: 8 },
    memberText: { color: "#333" },
});