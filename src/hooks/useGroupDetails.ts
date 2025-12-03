import { useGroups } from "@/hooks/useGroups";
import { useEffect, useState, useCallback } from "react";
import { getGroupDebts } from "@/services/groupService";
import { Group, GroupMember } from "@/types/Group";
import { DebtBetweenUsers } from "@/types/Debt";

export function useGroupDetails(
    groupId: string,
    role: "CREDITOR" | "DEBTOR" = "DEBTOR",
    status?: string
) {
    const { groups, loading: loadingGroups } = useGroups();
    const [debts, setDebts] = useState<DebtBetweenUsers[]>([]);
    const [loadingDebts, setLoadingDebts] = useState(false);

    const group = groups.find(g => g.groupId === groupId);
    const members: GroupMember[] = group?.members ?? [];

    const fetchDebts = useCallback(async () => {
        setLoadingDebts(true);
        try {
            const result = await getGroupDebts(groupId, role, status);
            setDebts(result);
        } catch {
            setDebts([]);
        } finally {
            setLoadingDebts(false);
        }
    }, [groupId, role, status]);

    useEffect(() => {
        if (groupId) fetchDebts();
    }, [groupId, fetchDebts]);

    return {
        group,
        members,
        debts,
        loading: loadingGroups || loadingDebts,
        refreshDebts: fetchDebts,
    };
}