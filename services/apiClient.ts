import { env } from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

        let url = `${this.baseUrl}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        let mergedHeaders = {
            ...this.defaultHeaders,
            ...headers,
        };

        // Solo agrega el access token si NO hay Authorization ya en headers
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            if (accessToken && !("Authorization" in mergedHeaders)) {
                mergedHeaders = {
                    ...mergedHeaders,
                    Authorization: `Bearer ${accessToken}`,
                };
                if (__DEV__) {
                    console.debug("[APIClient] Usando accessToken:", accessToken);
                }
            }
        } catch (e) {
            if (__DEV__) {
                console.debug("[APIClient] No se pudo leer accessToken:", e);
            }
        }

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
            throw err;
        }
    }

    private transformResponse(response: Response): Response {
        const originalJson = response.json.bind(response);

        response.json = async function () {
            const text = await response.text();
            if (!text) return {};
            const data = JSON.parse(text);
            return snakeToCamel(data);
        };

        return response;
    }

    setHeader(key: string, value: string) {
        this.defaultHeaders = {
            ...this.defaultHeaders,
            [key]: value,
        };
    }

    removeHeader(key: string) {
        const headers = { ...this.defaultHeaders };
        delete headers[key];
        this.defaultHeaders = headers;
    }
}

export default new ApiClient(env.apiUrl);
export { ApiClient };