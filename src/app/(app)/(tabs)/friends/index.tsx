import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFriends } from "@hook/useFriends";
import FriendList from "@component/friends/friendList";
import { useState } from "react";
import ScanButton from "@/components/friends/scanButton";
import { router } from "expo-router";

function ErrorState({
    error,
    onRetry,
}: {
    error: string;
    onRetry: () => void;
}) {
    return (
        <View style={styles.centerContent}>
            <Text style={styles.error}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
        </View>
    );
}

function EmptyState() {
    return (
        <View style={styles.centerContent}>
            <Text style={styles.description}>
                Aún no tienes amigos agregados.
            </Text>
        </View>
    );
}

function LoadMoreButton({
    loading,
    onPress,
}: {
    loading: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={onPress}
            disabled={loading}
        >
            <Text style={styles.loadMoreText}>Cargar más</Text>
        </TouchableOpacity>
    );
}

export default function FriendsView() {
    return (
        <View style={styles.container}>
            <View style={styles.scanButton}>
                <ScanButton
                    style={{ width: "35%" }}
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
