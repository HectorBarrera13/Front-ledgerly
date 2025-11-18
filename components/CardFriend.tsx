import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Friend } from "@/types/Friends";

interface CardFriendProps {
    friend: Friend;
    onRemove?: (id: string) => void;
}

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const CardFriend: React.FC<CardFriendProps> = ({ friend, onRemove }) => (
    <View style={styles.card}>
        <View>
            <Text style={styles.name}>
                {friend.firstName} {friend.lastName}
            </Text>
            <Text style={styles.phone}>{friend.phone}</Text>
            <Text style={styles.addedAt}>
                Agregado el: {formatDate(new Date(friend.addedAt))}
            </Text>
        </View>
        <TouchableOpacity onPress={() => onRemove && onRemove(friend.id)}>
            <Text style={styles.removeIcon}>❌</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    phone: {
        fontSize: 14,
        color: "#666",
    },
    removeIcon: {
        fontSize: 18,
        color: "red",
    },
    addedAt: {
        fontSize: 12,
        color: "#999",
    },
});
