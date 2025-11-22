import api, { ApiError } from "@service/apiClient";
import { Friend } from "@type/Friends";
import { Pageable } from "@type/utils";
import { manageApiError } from "@/libs/ErrorsMiddleware";
import { PresentableError } from "@/types/Errors";

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
            if (error instanceof ApiError) {
                const message = manageApiError(error.status, {
                    400: {
                        title: "Error al obtener amigos",
                        description:
                            "La solicitud para obtener la lista de amigos es inválida.",
                    },
                    404: {
                        title: "Amigos no encontrados",
                        description: "No se encontraron amigos en tu lista.",
                    },
                    default: {
                        title: "Error inesperado",
                        description:
                            "Ocurrió un error inesperado al obtener la lista de amigos.",
                    },
                });
                throw new PresentableError(message.title, message.description);
            } else {
                throw new Error(
                    error instanceof Error ? error.message : "Unknown error"
                );
            }
        }
    },

    add: async (id: string): Promise<Friend> => {
        try {
            return await api.post<Friend>(`/friends/${id}`);
        } catch (error) {
            if (error instanceof ApiError) {
                const message = manageApiError(error.status, {
                    400: {
                        title: "Error al añadir amigo",
                        description:
                            "La solicitud para añadir amigo es inválida.",
                    },
                    404: {
                        title: "Amigo no encontrado",
                        description: "No se encontró un usuario con ese ID.",
                    },
                    409: {
                        title: "El amigo ya ha sido añadido",
                        description: "Este amigo ya está en tu lista.",
                    },
                    default: {
                        title: "Error inesperado",
                        description:
                            "Ocurrió un error inesperado al añadir amigo.",
                    },
                });
                throw new PresentableError(message.title, message.description);
            }
            throw new Error(
                error instanceof Error ? error.message : "Unknown error"
            );
        }
    },

    remove: async (id: string): Promise<void> => {
        try {
            await api.delete(`/friends/${id}`);
        } catch (error) {
            if (error instanceof ApiError) {
                const message = manageApiError(error.status, {
                    400: {
                        title: "Error al eliminar amigo",
                        description:
                            "La solicitud para eliminar amigo es inválida.",
                    },
                    404: {
                        title: "Amigo no encontrado",
                        description: "No se encontró un amigo con ese ID.",
                    },
                    default: {
                        title: "Error inesperado",
                        description:
                            "Ocurrió un error inesperado al eliminar amigo.",
                    },
                });
                throw new PresentableError(message.title, message.description);
            } else {
                throw new Error(
                    error instanceof Error ? error.message : "Unknown error"
                );
            }
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
            if (error instanceof ApiError) {
                const message = manageApiError(error.status, {
                    404: {
                        title: "QR no encontrado",
                        description: "No se encontró el código QR.",
                    },
                    default: {
                        title: "Error inesperado",
                        description:
                            "Ocurrió un error inesperado al cargar el código QR.",
                    },
                });
                throw new PresentableError(message.title, message.description);
            }
            throw new Error(
                error instanceof Error ? error.message : "Unknown error"
            );
        }
    },
};

export default friendService;
