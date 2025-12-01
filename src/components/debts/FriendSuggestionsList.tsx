import React from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";

interface FriendSuggestion {
    id: string;
    name: string;
}

interface FriendSuggestionsListProps {
    suggestions: FriendSuggestion[];
    onSelect: (friend: FriendSuggestion) => void;
}

export default function FriendSuggestionsList({ suggestions, onSelect }: FriendSuggestionsListProps) {
    if (suggestions.length === 0) return null;
    return (
        <View style={styles.suggestionsContainer}>
            <FlatList
                data={suggestions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => onSelect(item)}
                    >
                        <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    suggestionsContainer: {
        marginTop: 4,
        marginBottom: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    suggestionText: {
        fontSize: 16,
        color: "#555",
    },
});