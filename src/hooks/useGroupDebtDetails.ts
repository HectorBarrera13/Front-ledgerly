import { useEffect, useState } from "react";
import { getGroupDebtById } from "@/services/groupService";

export function useGroupDebtDetails(groupId: string, debtId: string) {
    const [debt, setDebt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        getGroupDebtById(groupId, debtId)
            .then((data) => {
                if (isMounted) setDebt(data);
            })
            .catch(() => {
                if (isMounted) setDebt(null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [groupId, debtId]);

    return { debt, setDebt, loading };
}