import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";

interface Props {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

const ButtonAdd = ({ onPress, style, disabled }: Props) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.button, style]}
        disabled={disabled}
        activeOpacity={0.7}
    >
        <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#9B6AF7",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        elevation: 3, // sombra en Android
        shadowColor: "#000", // sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    plus: {
        color: "#fff",
        fontSize: 56,
        fontWeight: "bold",
        lineHeight: 64,
    },
});

export default ButtonAdd;