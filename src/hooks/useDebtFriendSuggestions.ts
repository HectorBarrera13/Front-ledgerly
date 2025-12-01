import { useState, useEffect } from "react";
import friendService from "@/services/friendService";

export function useDebtFriendSuggestions(myRole: "CREDITOR" | "DEBTOR", targetName: string) {
    const [friendSuggestions, setFriendSuggestions] = useState<{ id: string; name: string }[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    useEffect(() => {
        if (myRole === "CREDITOR" && targetName.length > 1) {
            setLoadingSuggestions(true);
            friendService.search(targetName)
                .then(friends => {
                    const mapped = (friends || []).map(friend => ({
                        id: friend.id,
                        name: `${friend.firstName} ${friend.lastName}`,
                    }));
                    setFriendSuggestions(mapped);
                })
                .catch(() => setFriendSuggestions([]))
                .finally(() => setLoadingSuggestions(false));
        } else {
            setFriendSuggestions([]);
        }
    }, [targetName, myRole]);

    return { friendSuggestions, loadingSuggestions };
}