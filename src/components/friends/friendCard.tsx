import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Friend } from "@type/Friends";
import { Button } from "@component/Button";

interface CardFriendProps {
    friend: Friend;
    onPress: () => void;
    onRemove: () => void;
}

export default function FriendCard(props: CardFriendProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const getInitials = () => {
        const firstInitial = props.friend.firstName.charAt(0).toUpperCase();
        const lastInitial = props.friend.lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                style={styles.card}
                onPress={props.onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <View style={styles.cardContent}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{getInitials()}</Text>
                    </View>

                    <View style={styles.info}>
                        <Text style={styles.name}>
                            {props.friend.firstName} {props.friend.lastName}
                        </Text>
                        <Text style={styles.phone}>{props.friend.phone}</Text>
                        <Text style={styles.addedAt}>
                            Agregado el{" "}
                            {formatDate(new Date(props.friend.addedAt))}
                        </Text>
                    </View>

                    <Pressable
                        style={styles.removeButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            props.onRemove();
                        }}
                    >
                        <Text style={styles.removeButtonText}>✕</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 15,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#9e60ed",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },
    info: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 2,
    },
    addedAt: {
        fontSize: 12,
        color: "#999999",
    },
    removeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#FFE5E5",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    removeButtonText: {
        color: "#FF3B30",
        fontSize: 18,
        fontWeight: "600",
    },
});
