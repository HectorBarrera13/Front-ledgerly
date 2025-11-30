import React from "react";
import { View, FlatList, StyleSheet, RefreshControl, Text } from "react-native";
import { useRouter } from "expo-router";
import { useGroups } from "@/hooks/useGroups";
import GroupCard from "@/components/groups/GroupCard";
import ButtonAdd from "@/components/ButtonAdd";

export default function GroupsView() {
    const router = useRouter();
    const { groups, loading, refresh } = useGroups();

    const handleDetails = (groupId: string) => {
        router.push(`/(modals)/groupDetails?id=${groupId}`);
    };

    const sortedGroups = [...groups].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedGroups}
                keyExtractor={(item, idx) => item.groupId ?? String(idx)}
                renderItem={({ item }) => (
                    <GroupCard
                        group={item}
                        onPress={handleDetails}
                        style={{ marginBottom: 16 }}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 80 }}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tienes grupos.</Text>
                }
            />
            <View style={styles.addBtnContainer}>
                <ButtonAdd onPress={() => router.push('/(modals)/newGroup')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#fff",
    },
    addBtnContainer: {
        position: "absolute",
        bottom: 24,
        paddingRight: 24,
        alignSelf: "flex-end",
    },
    emptyText: {
        textAlign: "center",
        color: "#888",
        marginTop: 32,
    },
});