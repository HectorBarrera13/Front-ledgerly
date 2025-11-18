import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { CardFriend } from "@/components/CardFriend";
import { Friend } from "@/types/Friends";

interface FriendListProps {
    friends: Friend[];
    onRemove?: (id: string) => void;
}

export const FriendList: React.FC<FriendListProps> = ({
    friends,
    onRemove,
}) => (
    <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <CardFriend friend={item} onRemove={onRemove} />
        )}
        contentContainerStyle={styles.list}
    />
);

const styles = StyleSheet.create({
    list: {
        padding: 10,
    },
});
export default FriendList;
