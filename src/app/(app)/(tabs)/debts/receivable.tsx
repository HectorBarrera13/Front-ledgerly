import React, { useState, useCallBack} from "react";
import { View, StyleSheet } from "react-native";
import ButtonAdd from "@/components/ButtonAdd";
import { useRouter, useFocusEffect } from "expo-router";
import CardDebt from "@/components/debts/debtCard";

export default function ReceivableView() {
    const router = useRouter();
        const [isNavigating, setIsNavigating] = useState(false); 
    const exampleDebt = {
        id: "r1",
        title: "Pago por servicio",
        creditor: "Ana",
        amount: 850.5,
    };

    const handleAddPress = () => {
        if (!isNavigating) {
            setIsNavigating(true);
        router.push("(modals)/newDebt");
        }
    };

    {useFocusEffect(
        React.useCallback(() => {
            setIsNavigating(false);
        }, [])
    );}

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <View style={styles.container}>
                <CardDebt
                    debt={exampleDebt}
                    onPress={(id) => router.push(`(modals)/debtDetails?id=${id}&mode=receivable`)}
                    onSettle={(id) => router.push(`(modals)/debtDetails?id=${id}&mode=receivable`)}
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
