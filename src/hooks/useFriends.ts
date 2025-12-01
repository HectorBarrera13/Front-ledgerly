import { useEffect, useState, useCallback, useRef } from "react";
import friendService from "@service/friendService";
import { Friend } from "@type/Friends";
import { PresentableError } from "@/types/Errors";

export function useFriends(limit: number = 8) {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [error, setError] = useState<PresentableError | null>(null);

    const initialFetchDone = useRef(false);

    const fetchFriends = useCallback(
        async (
            limit: number,
            cursor: string | null,
            append: boolean = false
        ) => {
            setLoading(true);
            try {
                const response = await friendService.getAll(limit, cursor);
                if (!response) {
                    return;
                }
                setFriends((prevFriends) =>
                    append
                        ? [...prevFriends, ...response.items]
                        : response.items
                );
                setCursor(response.nextCursor);
                setError(null);
            } catch (err) {
                const presentableError =
                    err instanceof PresentableError
                        ? err
                        : new PresentableError(
                              "Error inesperado",
                              "Ocurrió un error inesperado al obtener la lista de amigos."
                          );
                setError(presentableError);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const initFetch = useCallback(async () => {
        if (initialFetchDone.current) return;
        await fetchFriends(limit, null);
        initialFetchDone.current = true;
    }, []);

    const loadMore = useCallback(async () => {
        if (loading || !cursor) return;
        fetchFriends(limit, cursor, true);
    }, [cursor, friends, limit]);

    const refreshFriends = useCallback(async () => {
        await fetchFriends(limit, null);
    }, []);

    const removeFriend = useCallback(async (friendId: string) => {
        try {
            await friendService.remove(friendId);
            setFriends((prevFriends) =>
                prevFriends.filter((friend) => friend.id !== friendId)
            );
        } catch (err) {
            const presentableError =
                err instanceof PresentableError
                    ? err
                    : new PresentableError(
                          "Error inesperado",
                          "Ocurrió un error inesperado al eliminar al amigo."
                      );
            setError(presentableError);
        }
    }, []);

    useEffect(() => {
        initFetch();
    }, []);

    return {
        friends,
        loading,
        error,
        hasMore: !!cursor,
        loadMore,
        refreshFriends,
        removeFriend,
    };
}
