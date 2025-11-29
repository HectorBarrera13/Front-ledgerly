import { useState, useEffect, useCallback } from "react";
import debtService from "@/services/debtService";
import { DebtBetweenUsers, QuickDebt } from "@/types/Debt";

type DebtType = "betweenUsers" | "quick";
type RoleType = "CREDITOR" | "DEBTOR";

export function useDebts(type: DebtType, role: RoleType, status?: string) {
    const [debts, setDebts] = useState<(DebtBetweenUsers | QuickDebt)[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDebts = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (type === "betweenUsers") {
                response = await debtService.fetchDebtsBetweenUsers(role, status);
            } else {
                response = await debtService.fetchQuickDebts(role, status);
            }
            setDebts(response?.items ?? []);
        } catch (error) {
            setDebts([]);
        } finally {
            setLoading(false);
        }
    }, [type, role, status]);

    useEffect(() => {
        fetchDebts();
    }, [fetchDebts]);

    return { debts, loading, refresh: fetchDebts };
}