import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/Button";
import CloseButton from "@/components/CloseButton";
import DebtInfo from "@/components/debts/DebtInfo";
import AvatarInitials from "@/components/AvatarInitials";
import { getGroupMembers, createGroupDebt } from "@/services/groupService";
import { GroupMember } from "@/types/Group";
import { useAuth } from "@/providers/AuthContext";

const getParam = (value: string | string[] | undefined, defaultValue = ""): string => {
    return Array.isArray(value) ? value[0] ?? defaultValue : value ?? defaultValue;
};

export default function AddMembersGroupDebt() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { profile } = useAuth();
    const currentUserId = profile?.user.id;

    const groupId = getParam(params.groupId);
    const concept = getParam(params.concept);
    const description = getParam(params.description);
    const splitParam = getParam(params.split);
    const amount = getParam(params.amount, "0");
    const initialEqual = splitParam === "equal";
    const total = Number.parseFloat(amount) || 0;

    const [members, setMembers] = useState<GroupMember[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    useEffect(() => {
        async function fetchMembers() {
            setLoadingMembers(true);
            try {
                const result = await getGroupMembers(groupId);
                setMembers(result);
            } catch (err) {
                setMembers([]);
            } finally {
                setLoadingMembers(false);
            }
        }
        if (groupId) fetchMembers();
    }, [groupId]);

    const [selected, setSelected] = useState<string[]>([]);
    useEffect(() => {
        if (members.length) setSelected(members.map(m => m.id));
    }, [members]);

    const [amountsPer, setAmountsPer] = useState<Record<string, string>>({});
    useEffect(() => {
        if (initialEqual && members.length) {
            const per = (total / members.length).toFixed(2);
            const next: Record<string, string> = {};
            for (const m of members) next[m.id] = per;
            setAmountsPer(next);
        } else if (members.length) {
            const next: Record<string, string> = {};
            for (const m of members) next[m.id] = "";
            setAmountsPer(next);
        }
    }, [members, initialEqual, total]);

    useEffect(() => {
        if (initialEqual) {
            const per = selected.length ? (total / selected.length).toFixed(2) : "0.00";
            const next: Record<string, string> = {};
            for (const id of selected) next[id] = per;
            setAmountsPer(next);
        }
    }, [selected.length, initialEqual, total]);

    const handleAmountChange = (id: string, value: string) => {
        const cleanedValue = value.replace(/[^0-9.]/g, '');

        const parts = cleanedValue.split('.');
        if (parts.length > 2) {
            return;
        }
        
        if (parts[1] && parts[1].length > 2) {
            return;
        }
        
        setAmountsPer(prev => ({ ...prev, [id]: cleanedValue }));
    };

    const [memberName, setMemberName] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const filteredMembers = members.filter(
        (m) =>
            `${m.firstName} ${m.lastName}`.toLowerCase().includes(memberName.toLowerCase()) &&
            !selected.includes(m.id)
    );

    const addMember = (id: string) => {
        if (!selected.includes(id)) setSelected((prev) => [...prev, id]);
        setMemberName("");
        setShowSuggestions(false);
        if (initialEqual) {
            const newCount = selected.length + 1;
            const per = (total / newCount).toFixed(2);
            const next: Record<string, string> = {};
            for (const mId of [...selected, id]) next[mId] = per;
            setAmountsPer(next);
        }
    };

    const removeMember = (id: string) => {
        setSelected((prev) => prev.filter((x) => x !== id));
    };

    const [dynamicAmounts, setDynamicAmounts] = useState(0);
    useEffect(() => {
        const totalAmount = Object.values(amountsPer).map((v) => Number.parseFloat(v) || 0).reduce((a, b) => a + b, 0);
        setDynamicAmounts(totalAmount);
    }, [amountsPer]);

    const handleFinishDebt = async () => {
        try {
            const debtors = selected
                .filter((id) => id !== currentUserId)
                .map((id) => ({
                    debtorId: id,
                    amount: Math.round(Number.parseFloat(amountsPer[id]) * 100) || 0,
                }));
            await createGroupDebt({
                group_id: groupId,
                purpose: concept,
                description,
                currency: "MXN",
                debtors,
            });
            Alert.alert("Éxito", "Deuda de grupo creada correctamente");
            router.push("/(tabs)/groups");
        } catch (error) {
            Alert.alert("Error", "No se pudo crear la deuda de grupo");
        }
    };

    if (loadingMembers) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Cargando miembros...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nueva deuda</Text>
                    <CloseButton />
                </View>

                <DebtInfo
                    concept={concept}
                    description={description}
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
                    {showSuggestions && filteredMembers.length > 0 && (
                        <View style={styles.suggestionsBox}>
                            {filteredMembers.map((m) => (
                                <Pressable
                                    key={m.id}
                                    style={styles.suggestionItem}
                                    onPress={() => addMember(m.id)}
                                >
                                    <Text style={styles.suggestionText}>{m.firstName} {m.lastName}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.membersBox}>
                    <Text style={styles.label}>Integrantes de la deuda</Text>
                    {selected.map((id) => {
                        const member = members.find(m => m.id === id);
                        if (!member) return null;
                        const displayName = id === currentUserId ? "Tú" : `${member.firstName} ${member.lastName}`;
                        return (
                            <View key={id} style={[styles.memberRow, { justifyContent: 'space-between' }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    {member.picture ? (
                                        <Image
                                            source={{ uri: member.picture }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                        <AvatarInitials
                                            firstName={member.firstName}
                                            lastName={member.lastName}
                                            size={32}
                                            style={{ marginRight: 8 }}
                                        />
                                    )}
                                    <Text style={[styles.memberText, { flex: 1 }]}>{displayName}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={styles.amountInput}
                                        value={amountsPer[id] ?? ""}
                                        onChangeText={(v) => handleAmountChange(id, v)}
                                        keyboardType="numeric"
                                        editable={!initialEqual}
                                        placeholder="$0.00"
                                    />
                                    <Pressable onPress={() => removeMember(id)} style={{ marginLeft: 12 }}>
                                        <Text style={{ color: '#d00', fontWeight: '700' }}>✕</Text>
                                    </Pressable>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <Button
                    title="Finalizar deuda"
                    onPress={handleFinishDebt}
                    style={styles.continueBtn}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5" },
    content: { padding: 24, paddingTop: 36, paddingBottom: 120 },
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
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f0f0f0",
        marginRight: 8,
    },
    continueBtn: {
        marginTop: 24,
        width: "100%",
        height: 56,
        borderRadius: 32,
        backgroundColor: "#6C1ED6",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6C1ED6",
        marginBottom: 6,
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
    inputContainer: {
        marginBottom: 24,
        marginHorizontal: 10,
        marginTop: 14,
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