import { useEffect, useState } from "react";
import { getGroupDebts } from "@/services/groupService";
import { DebtBetweenUsers } from "@/types/Debt";

export function useGroupDebts(groupId: string) {
    const [debts, setDebts] = useState<DebtBetweenUsers[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        getGroupDebts(groupId)
            .then((data) => {
                if (isMounted) setDebts(data);
            })
            .catch(() => {
                if (isMounted) setDebts([]);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [groupId]);

    return { debts, loading };
}