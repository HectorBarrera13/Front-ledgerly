import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface AvatarInitialsProps {
    firstName: string;
    lastName: string;
    size?: number;
    style?: ViewStyle;
}

export default function AvatarInitials({
    firstName,
    lastName,
    size = 56,
    style,
}: AvatarInitialsProps) {
    const getInitials = () => {
        const firstInitial = firstName?.charAt(0).toUpperCase() || "";
        const lastInitial = lastName?.charAt(0).toUpperCase() || "";
        return `${firstInitial}${lastInitial}`;
    };

    return (
        <View
            style={[
                styles.avatarContainer,
                { width: size, height: size, borderRadius: size / 2 },
                style,
            ]}
        >
            <Text style={[styles.avatarText, { fontSize: size / 2.8 }]}>
                {getInitials()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        backgroundColor: "#9e60ed",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});