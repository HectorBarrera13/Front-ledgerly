import api from "@service/apiClient";
import { Friend } from "@type/Friends";
import { Pageable } from "@type/utils";

const friendService = {
    getAll: async (
        limit: number,
        cursor: string | null
    ): Promise<Pageable<Friend, string>> => {
        try {
            const params = cursor
                ? `?limit=${limit}&cursor=${cursor}`
                : `?limit=${limit}`;
            const response = await api.get<Pageable<Friend, string>>(
                `/friends${params}`
            );
            return response;
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Unknown error"
            );
        }
    },

    add: async (id: string): Promise<Friend> => {
        try {
            return await api.post<Friend>(`/friends/${id}`);
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Unknown error"
            );
        }
    },

    remove: async (id: string): Promise<void> => {
        try {
            await api.delete(`/friends/${id}`);
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Unknown error"
            );
        }
    },

    loadQr: async (): Promise<string> => {
        try {
            const response = await api.fetch("/friends/qr", {
                method: "GET",
            });
            const arrayBuffer = await response.arrayBuffer();
            const base64String = btoa(
                String.fromCharCode(...new Uint8Array(arrayBuffer))
            );
            return `data:image/png;base64,${base64String}`;
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Unknown error"
            );
        }
    },
};

export default friendService;
