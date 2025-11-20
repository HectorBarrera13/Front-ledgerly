import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Friend } from "@type/Friends";

interface CardFriendProps {
    friend: Friend;
    onPress?: (id: string) => void;
    onRemove?: (id: string) => void;
}

export default function FriendCard({
    friend,
    onPress,
    onRemove,
}: CardFriendProps) {
    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress && onPress(friend.id)}
        >
            <View>
                <View style={styles.info}>
                    <Text style={styles.name}>
                        {friend.firstName} {friend.lastName}
                    </Text>
                    <Text style={styles.phone}>{friend.phone}</Text>
                    <Text style={styles.addedAt}>
                        Agregado el: {formatDate(new Date(friend.addedAt))}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => onRemove && onRemove(friend.id)}
                >
                    <Text style={styles.removeIcon}>eliminar</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {},
    info: {},
    name: {},
    phone: {},
    addedAt: {},
    removeIcon: {},
});
