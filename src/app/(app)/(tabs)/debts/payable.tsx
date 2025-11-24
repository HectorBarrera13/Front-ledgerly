import React from "react";
import { View, StyleSheet } from "react-native";
import ButtonAdd from "@/components/ButtonAdd";
import { useRouter } from "expo-router";
import CardDebt from "@/components/debts/DebtCard";
 

export default function PayableView() {
    const router = useRouter();

    const exampleDebt = {
        id: "d1",
        title: "Cena del viernes",
        creditor: "Franchesco",
        amount: 12345.67,
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <View style={styles.container}>
                <CardDebt
                    debt={exampleDebt}
                    onPress={(id) => router.push(`(modals)/debtDetails?id=${id}&mode=payable`)}
                    onSettle={(id) => router.push(`(modals)/debtDetails?id=${id}&mode=payable`)}
                />
            </View>

            <View style={styles.addBtnContainer}>
                <ButtonAdd onPress={() => router.push("(modals)/newDebt")} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 24,
    },
    addBtnContainer: {
        position: "absolute",
        bottom: 24,
        paddingRight: 24,
        alignSelf: "flex-end",
    },
});
