import React from "react";
import { FlatList, StyleSheet } from "react-native";
import  {CardDebt}  from "@/components/debts/debtCard";
import { Debt } from "@type/Debt";

interface DebtsListProps {
    debts: Debt[];
    onSettle?: (id: string) => void;
}

const DebtsList: React.FC<DebtsListProps> = ({ debts, onSettle }) => (
    <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardDebt debt={item} onSettle={onSettle} />}
        contentContainerStyle={styles.list}
    />
);

const styles = StyleSheet.create({
    list: {
        padding: 16,
    },
});

export default DebtsList;
