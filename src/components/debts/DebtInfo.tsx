import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DebtInfoProps {
    concept: string;
    description: string;
    amount: number;
}

const DebtInfo: React.FC<DebtInfoProps> = ({ concept, description, amount }) => {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.concept}>{concept}</Text>
                    <Text style={styles.desc}>{description}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <View style={styles.amountInnerContainer}>
                        <Text style={styles.amount}>${amount.toFixed(2)}</Text>
                        <Text style={styles.montoLabel}>Monto</Text>
                    </View>
                </View>
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#6C1ED6",
        borderRadius: 23,
        padding: 28,
        margin: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    concept: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    desc: {
        color: "#fff",
        fontSize: 18,
        marginTop: 8,
    },
    amountContainer: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        flex: 1,
    },
    amountInnerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    amount: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold",
    },
    montoLabel: {
        color: "#fff",
        fontSize: 18,
        marginTop: 4,
    },
});

export default DebtInfo;