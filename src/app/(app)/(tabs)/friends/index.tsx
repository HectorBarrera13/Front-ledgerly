import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useFriends } from "@hook/useFriends";
import FriendList from "@component/friends/friendList";
import AddFriendBar from "@component/friends/addFriendBar";
import AddFriendModal from "@component/modals/qrFriend";
import { useState } from "react";

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
    const { friends, loading, error, loadMoreFriends, hasMore, removeFriend } =
        useFriends();
    const [isModalVisible, setModalVisible] = useState(false);

    const isInitialLoading = loading && friends.length === 0;
    const hasNoFriends = friends.length === 0 && !loading;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Amigos</Text>

            {error && !isInitialLoading && (
                <ErrorState error={error} onRetry={loadMoreFriends} />
            )}

            {hasNoFriends && !error && <EmptyState />}

            {friends.length > 0 && (
                <>
                    <FriendList friends={friends} onRemove={removeFriend} />
                    {hasMore && (
                        <LoadMoreButton
                            loading={loading}
                            onPress={loadMoreFriends}
                        />
                    )}
                </>
            )}
            <AddFriendBar
                onPressGenerateQr={() => setModalVisible(true)}
                onPressScanQr={() => router.push("")}
            />
            <AddFriendModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
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
});
