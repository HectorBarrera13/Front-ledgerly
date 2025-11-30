import { useState, useEffect, useCallback } from "react";
import { getMyGroups } from "@/services/groupService";
import { Group } from "@/types/Group";

export function useGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getMyGroups();
            setGroups(result ?? []);
        } catch {
            setGroups([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return { groups, loading, refresh: fetchGroups };
}