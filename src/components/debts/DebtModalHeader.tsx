import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function DebtModalHeader({ title }: { title: string }) {
    const router = useRouter();
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => router.replace("/debts")}
            >
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#e5e5e5",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    closeText: {
        fontSize: 22,
        color: "#555",
    },
});