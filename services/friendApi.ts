import api from "@/services/apiClient";
import { Friend } from "@/types/Friends";
import { Pageable } from "@/types/utils";

const resolveParams = (limit: number, cursor: string | null) => {
    if (cursor) {
        return { limit: limit, cursor: cursor };
    }
    return { limit: limit };
};

export const friendService = {
    getAll: async (
        limit: number,
        cursor: string | null
    ): Promise<Pageable<Friend, string>> => {
        const response = await api.fetch("/friends", {
            params: resolveParams(limit, cursor),
        });
        if (!response.ok) {
            throw new Error(
                `Error fetching friends: ${response.status.valueOf()}`
            );
        }
        return response.json();
    },

    add: async (id: string): Promise<Friend> => {
        const response = await api.fetch(`/friends/${id}`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(
                `Error creating friend: ${response.status.valueOf()}`
            );
        }
        return response.json();
    },

    remove: async (id: string): Promise<void> => {
        const response = await api.fetch(`/friends/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(
                `Error deleting friend: ${response.status.valueOf()}`
            );
        }
    },

    loadQr: async (): Promise<string> => {
        const response = await api.fetch("/friends/qr", {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(
                `Error generating QR code: ${response.status.valueOf()}`
            );
        }

        const arrayBuffer = await response.arrayBuffer();

        // Convertir a base64
        const base64 = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer))
        );

        // Data URI usable en React Native
        return `data:image/jpeg;base64,${base64}`;
    },
};
