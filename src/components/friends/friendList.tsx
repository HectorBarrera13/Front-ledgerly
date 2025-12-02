import React from "react";
import {
    StyleSheet,
    FlatList,
    View,
    ActivityIndicator,
    Text,
    ScrollView,
} from "react-native";
import { Friend } from "@type/Friends";
import FriendCard from "@component/friends/friendCard";
import { RefreshControl } from "react-native";

interface CardFriendProps {
    friends: Friend[];
    onPress: (friendId: string) => void;
    onRemove: (friendId: string) => void;
    onLoadMore: () => void;
    onRefresh: () => void;
    loading: boolean;
    refreshing: boolean;
    hasMore: boolean;
}

export default function FriendList({
    friends,
    onPress,
    onRemove,
    onLoadMore,
    onRefresh,
    loading,
    refreshing,
    hasMore,
}: CardFriendProps) {
    if (friends.length === 0 && !loading) {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                        colors={["#7519EB"]} // Android
                        tintColor="#7519EB" // iOS
                    />
                }
                contentContainerStyle={styles.noFriendsContainer}
                style={{ flex: 1 }}
            >
                <View>
                    <Text style={styles.noFriendsText}>
                        No tienes amigos aún. ¡Agrega algunos!
                    </Text>
                </View>
            </ScrollView>
        );
    }

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#7519EB" />
            </View>
        );
    }

    return (
        <FlatList
            data={friends}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <FriendCard
                    friend={item}
                    onPress={() => onPress(item.id)}
                    onRemove={() => onRemove(item.id)}
                />
            )}
            onEndReached={() => {
                if (hasMore && !loading) {
                    onLoadMore();
                }
            }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#7519EB"]} // Android
                    tintColor="#7519EB" // iOS
                />
            }
            onEndReachedThreshold={0.5}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: 100,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200, // Asegura un tamaño mínimo visible
    },
    noFriendsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
    },
    noFriendsText: {
        fontSize: 16,
        color: "#555",
    },
});
