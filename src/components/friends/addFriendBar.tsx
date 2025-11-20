import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AddFriendBarProps {
    onPressGenerateQr: () => void;
    onPressScanQr: () => void;
}

export default function AddFriendBar({
    onPressGenerateQr,
    onPressScanQr,
}: AddFriendBarProps) {
    return (
        <View style={styles.bar}>
            <TouchableOpacity
                style={styles.qrButton}
                onPress={onPressGenerateQr}
            >
                <Text style={styles.buttonText}>Generar QR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.scanButton} onPress={onPressScanQr}>
                <Text style={styles.buttonText}>Escanear QR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginVertical: 10,
    },
    qrButton: {},
    scanButton: {},
    buttonText: {},
});
