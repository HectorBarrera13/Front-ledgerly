import React from "react";
import { View, StyleSheet } from "react-native";
import { Friend } from "@/types/Friends";
import FriendCard from "./friendCard";

interface CardFriendProps {
    friends: Friend[];
    onPress?: (id: string) => void;
    onRemove?: (id: string) => void;
}

export default function FriendList({
    friends,
    onPress,
    onRemove,
}: CardFriendProps) {
    return (
        <View style={styles.container}>
            {friends.map((friend) => (
                <FriendCard
                    key={friend.id}
                    friend={friend}
                    onPress={onPress}
                    onRemove={onRemove}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
});
