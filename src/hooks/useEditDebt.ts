import { useEffect, useState } from "react";
import debtService from "@/services/debtService";
import { DebtBetweenUsers, QuickDebt } from "@/types/Debt";

export function useEditDebt(id: string | undefined, type: string | undefined) {
    const [concept, setConcept] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [debt, setDebt] = useState<DebtBetweenUsers | QuickDebt | null>(null);

    useEffect(() => {
        const fetchDebt = async () => {
            setLoading(true);
            try {
                let result: DebtBetweenUsers | QuickDebt;
                if (type === "betweenUsers") {
                    result = await debtService.fetchDebtsBetweenUsersById(id as string) as DebtBetweenUsers;
                } else {
                    result = await debtService.fetchQuickDebtById(id as string) as QuickDebt;
                }
                setDebt(result); 
                setConcept(result.purpose || "");
                setAmount(String(result.amount));
                setDescription(result.description || "");
            } catch (error) {
                console.error("Error fetching debt:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDebt();
    }, [id, type]);

    return {
        concept,
        setConcept,
        amount,
        setAmount,
        description,
        setDescription,
        loading,
        debt,
        setDebt,
    };
}