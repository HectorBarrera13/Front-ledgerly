import { View, StyleSheet } from "react-native";
import FriendList from "@component/friends/friendList";
import ScanButton from "@/components/friends/scanButton";
import { router, useLocalSearchParams } from "expo-router";
import { useFriends } from "@/hooks/useFriends";
import ErrorScreen from "@/components/ErrorScreen";
import { useEffect } from "react";

export default function FriendsView() {
    const {
        friends,
        loading,
        hasMore,
        error,
        loadMore,
        removeFriend,
        refreshFriends,
    } = useFriends();
    const { reload = "false" } = useLocalSearchParams();

    useEffect(() => {
        if (reload === "true") {
            refreshFriends();
        }
    }, [reload]);

    return (
        <View style={styles.container}>
            {error ? (
                <View style={styles.errorContainer}>
                    <ErrorScreen
                        title={error?.title}
                        description={error?.description}
                        onRetry={loadMore}
                        showRetryButton={true}
                    />
                </View>
            ) : (
                <FriendList
                    friends={friends}
                    onPress={(friendId) => {
                        console.log("Pressed friend with ID:", friendId);
                    }}
                    onRemove={(friendId) => {
                        removeFriend(friendId);
                    }}
                    onLoadMore={loadMore}
                    refreshing={loading && friends.length === 0}
                    onRefresh={refreshFriends}
                    loading={loading}
                    hasMore={hasMore}
                />
            )}
            <ScanButton
                style={styles.scanButton}
                title="Escanear QR"
                onPress={() => {
                    router.push("scanQr");
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    centerContent: {},
    description: {},
    emptyIcon: {},
    loadingText: {},
    retryButton: {},
    retryText: {},
    loadMoreButton: {},
    loadMoreText: {},
    error: {
        color: "red",
        fontSize: 16,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        textAlign: "center",
        padding: 8,
    },
    scanButton: {
        position: "absolute",
        width: "50%",
        bottom: 10,
        left: "25%",
        right: 0,
        alignItems: "center", // Centra el botón horizontalmente
        height: 48, // Opional: para darle un espacio
    },
});
