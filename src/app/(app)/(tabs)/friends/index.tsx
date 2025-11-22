import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFriends } from "@hook/useFriends";
import FriendList from "@component/friends/friendList";
import { useState } from "react";
import ScanButton from "@/components/friends/scanButton";
import { router } from "expo-router";

export default function FriendsView() {
    return (
        <View style={styles.container}>
            <View style={styles.scanButton}>
                <ScanButton
                    style={{ width: "90%" }}
                    title="Escanear QR"
                    onPress={() => {
                        router.push("scanQr");
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: {},
    centerContent: {},
    description: {},
    emptyIcon: {},
    loadingText: {},
    error: {},
    retryButton: {},
    retryText: {},
    loadMoreButton: {},
    loadMoreText: {},
    scanButton: {
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: "center", // Centra el botón horizontalmente
        height: 48, // Opional: para darle un espacio
    },
});
