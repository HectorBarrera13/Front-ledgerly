import apiClient from "@/services/apiClient";

export async function uploadProfilePicture(formData: FormData): Promise<{ url: string }> {
    const response = await apiClient.fetch("/users/upload-picture", {
        method: "POST",
        headers: {
            ...(apiClient['accessToken'] ? { Authorization: `Bearer ${apiClient['accessToken']}` } : {}),
            "X-Client-Type": "mobile",
        },
        body: formData,
    });

    if (!response.ok) {
        let errorData: any = {};
        try {
            const text = await response.text();
            errorData = text ? JSON.parse(text) : {};
        } catch {
            errorData = {};
        }
        throw new Error(errorData?.message || "Error al subir la imagen");
    }

    const text = await response.text();
    if (!text) {
        return { url: "" };
    }
    return JSON.parse(text);
}

export async function getProfilePicture(): Promise<{ url: string }> {
    const response = await apiClient.get<{ url: string }>("/users/picture");
    return response;
}