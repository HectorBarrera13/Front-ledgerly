import { useEffect, useState, useCallback } from "react";
import friendService from "@service/friendService";
import { Friend } from "@type/Friends";

export function useFriends(limit: number = 5) {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(false);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
        return Array.from(
            new Map(items.map((item) => [item.id, item])).values()
        );
    };

    useEffect(() => {
        loadInitialFriends();
    }, []);

    const printDebug = (error: any) => {
        if (__DEV__) {
            console.error("[useFriends]", error);
        }
    };

    const loadInitialFriends = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await friendService.getAll(limit, null);
            if (data) {
                setFriends(data.items);
                setCursor(data.nextCursor || undefined);
                setHasMore(
                    data.nextCursor !== undefined && data.nextCursor !== null
                );
            }
        } catch (error) {
            printDebug(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load friends"
            );
        } finally {
            setLoading(false);
        }
    }, [limit]);

    const loadMoreFriends = useCallback(async () => {
        if (loading || !hasMore || cursor === undefined) return;

        try {
            setLoading(true);
            setError(null);

            const data = await friendService.getAll(limit, cursor);
            if (data) {
                setFriends((prev) => uniqueById([...prev, ...data.items]));
                setCursor(data.nextCursor || undefined);
                setHasMore(
                    data.nextCursor !== undefined && data.nextCursor !== null
                );
            }
        } catch (error) {
            printDebug(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load more friends"
            );
        } finally {
            setLoading(false);
        }
    }, [limit, loading, hasMore, cursor]);

    const addFriend = useCallback(async (id: string) => {
        try {
            const newFriend = await friendService.add(id);
            setFriends((prev) => uniqueById([newFriend, ...prev]));
        } catch (error) {
            printDebug(error);
            setError(
                error instanceof Error ? error.message : "Failed to add friend"
            );
        }
    }, []);

    const removeFriend = useCallback(
        async (id: string) => {
            const previousFriends = friends;
            try {
                setFriends((prev) => prev.filter((f) => f.id !== id));
                await friendService.remove(id);
            } catch (error) {
                setFriends(previousFriends);
                printDebug(error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to remove friend"
                );
            }
        },
        [friends]
    );

    return {
        friends,
        loading,
        hasMore,
        error,
        addFriend,
        removeFriend,
        loadMoreFriends,
        refresh: loadInitialFriends,
    };
}
