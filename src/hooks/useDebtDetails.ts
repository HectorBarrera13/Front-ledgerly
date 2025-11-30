import { useEffect, useState } from "react";
import debtService from "@/services/debtService";

export function useDebtDetails(id: string | undefined, type: string | undefined) {
    const [debt, setDebt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebt = async () => {
            setLoading(true);
            try {
                let result;
                if (type === "betweenUsers") {
                    result = await debtService.fetchDebtsBetweenUsersById(id as string);
                } else {
                    result = await debtService.fetchQuickDebtById(id as string);
                }
                setDebt(result);
            } catch (error) {
                setDebt(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDebt();
    }, [id, type]);

    return { debt, setDebt, loading };
}