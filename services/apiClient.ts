// services/apiClient.ts
import { env } from "@/config/env";

function snakeToCamel(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamel(item));
    }

    const result: any = {};

    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
            letter.toUpperCase()
        );
        result[camelKey] = snakeToCamel(obj[key]);
    }

    return result;
}

function camelToSnake(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => camelToSnake(item));
    }

    const result: any = {};

    for (const key in obj) {
        const snakeKey = key.replace(
            /[A-Z]/g,
            (letter) => `_${letter.toLowerCase()}`
        );
        result[snakeKey] = camelToSnake(obj[key]);
    }

    return result;
}

type FetchOptions = RequestInit & {
    params?: Record<string, any>;
    skipCaseConversion?: boolean;
    timeout?: number;
};

class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            "Content-Type": "application/json",
            ...defaultHeaders,
        };
    }

    /**
     * Wrapper sobre fetch que agrega baseURL y headers por defecto
     */
    async fetch(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<Response> {
        const {
            params,
            headers,
            body,
            skipCaseConversion = false,
            timeout = 3000,
            ...fetchOptions
        } = options;

        // Construir URL con query params si existen
        let url = `${this.baseUrl}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        // Merge headers (los del request sobreescriben los default)
        const mergedHeaders = {
            ...this.defaultHeaders,
            ...headers,
        };

        let processedBody = body;
        if (body && !skipCaseConversion) {
            processedBody = JSON.stringify(camelToSnake(body));
        }

        if (__DEV__) {
            console.debug(`[API] ${options.method || "GET"} ${url}`);
        }

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers: mergedHeaders,
                body: processedBody,
                signal: controller.signal,
            });

            clearTimeout(id);

            if (!skipCaseConversion) {
                return this.transformResponse(response);
            }
            return response;
        } catch (err) {
            clearTimeout(id);
            throw err; // ➜ esto llegará a tu hook useFriends
        }
    }

    private transformResponse(response: Response): Response {
        // Crea un nuevo Response con json() sobrescrito
        const originalJson = response.json.bind(response);

        response.json = async function () {
            const data = await originalJson();
            return snakeToCamel(data); // ✅ Auto-convierte
        };

        return response;
    }

    /**
     * Actualizar headers por defecto (útil para agregar token después del login)
     */
    setHeader(key: string, value: string) {
        this.defaultHeaders = {
            ...this.defaultHeaders,
            [key]: value,
        };
    }

    /**
     * Remover un header
     */
    removeHeader(key: string) {
        const headers = { ...this.defaultHeaders };
        delete headers[key];
        this.defaultHeaders = headers;
    }
}

// Exportar instancia singleton
export default new ApiClient(env.apiUrl);

// También exportar la clase
export { ApiClient };
