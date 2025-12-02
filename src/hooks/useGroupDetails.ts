import { useGroups } from "@/hooks/useGroups";
import { useEffect, useState, useCallback } from "react";
import { getGroupDebts } from "@/services/groupService";
import { Group, GroupMember } from "@/types/Group";
import { GroupDebt } from "@/components/groups/CardGroupDebt";

export function useGroupDetails(groupId: string) {
    const { groups, loading: loadingGroups } = useGroups();
    const [debts, setDebts] = useState<GroupDebt[]>([]);
    const [loadingDebts, setLoadingDebts] = useState(false);

    const group = groups.find(g => g.groupId === groupId);
    const members: GroupMember[] = group?.members ?? [];

    const fetchDebts = useCallback(async () => {
        setLoadingDebts(true);
        try {
            const result = await getGroupDebts(groupId);
            setDebts(result);
        } catch {
            setDebts([]);
        } finally {
            setLoadingDebts(false);
        }
    }, [groupId]);

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