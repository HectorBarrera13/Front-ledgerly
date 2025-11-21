import React from "react";
import { View, StyleSheet } from "react-native";
import ButtonAdd from "@/components/ButtonAdd";
import { useRouter } from "expo-router";

export default function DebtsView() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <View style={styles.addBtnContainer}>
                <ButtonAdd onPress={() => router.push("(modals)/newDebt")} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    addBtnContainer: {
        position: "absolute",
        bottom: 32,
        alignSelf: "center",
    },
});