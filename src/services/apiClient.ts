// services/apiClient.ts
import { env } from "@config/env";
import { camelToSnake, snakeToCamel } from "@lib/convertBody";

class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

class TimeoutError extends Error {
    constructor(message: string = "Request timeout") {
        super(message);
        this.name = "TimeoutError";
    }
}

class NetworkError extends Error {
    constructor(message: string = "Network error - check your connection") {
        super(message);
        this.name = "NetworkError";
    }
}

const clientTypeHeader = {
    "X-Client-Type": "mobile",
};

interface FetchOptions extends Omit<RequestInit, "method" | "body" | "signal"> {
    timeout?: number;
}

const timeoutDurationDefault = 30000; // 30 segundos

type refreshHook = () => Promise<boolean>;

class ApiClient {
    private baseUrl: string;
    private accessToken: string | null = null;
    private accessExpiry: number | null = null;
    private refreshHook: refreshHook | null = null;

    public setRefreshHook(hook: refreshHook) {
        this.refreshHook = hook;
    }

    get url() {
        return this.baseUrl;
    }

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setAccessToken(token: string, expiry: number) {
        this.accessToken = token;
        this.accessExpiry = expiry;
    }

    private async fetchWrapper<T, R>(
        endpoint: string,
        data: T,
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        options?: FetchOptions
    ): Promise<R> {
        if (this.accessExpiry && Date.now() >= this.accessExpiry) {
            if (this.refreshHook) {
                const refreshed = await this.refreshHook();
                if (refreshed) {
                    return this.fetchWrapper<T, R>(
                        endpoint,
                        data,
                        method,
                        options
                    );
                }
            }
        }
        console.log(`API Request: ${method} ${endpoint}`);
        const controller = new AbortController();
        const timeout = options?.timeout ?? timeoutDurationDefault;
        const id = setTimeout(() => controller.abort(), timeout);

        const url = `${this.baseUrl}${endpoint}`;

        const {
            timeout: _timeout,
            headers: customHeaders,
            ...restOptions
        } = options || {};

        const finalHeaders = {
            "Content-Type": "application/json",
            ...clientTypeHeader,
            ...(this.accessToken
                ? { Authorization: `Bearer ${this.accessToken}` }
                : {}),
            ...customHeaders,
        };

        try {
            const response = await fetch(url, {
                ...restOptions,
                method,
                headers: finalHeaders,
                body:
                    data !== null && data !== undefined
                        ? JSON.stringify(camelToSnake(data))
                        : undefined,
                signal: controller.signal,
            });

            clearTimeout(id);
            const contentType = response.headers.get("Content-Type");
            if (!response.ok && response.status === 401) {
                if (this.refreshHook) {
                    const refreshed = await this.refreshHook();
                    if (refreshed) {
                        return this.fetchWrapper<T, R>(
                            endpoint,
                            data,
                            method,
                            options
                        );
                    }
                }
            }

            if (contentType && contentType.includes("application/json")) {
                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage =
                        errorData.message || "An error occurred";
                    throw new ApiError(errorMessage, response.status);
                } else {
                    const responseData = await response.json();
                    return snakeToCamel(responseData) as R;
                }
            } else {
                if (!response.ok) {
                    throw new ApiError(
                        `HTTP error! status: ${response.status}`,
                        response.status
                    );
                }
                return null as unknown as R;
            }
        } catch (error) {
            console.error("Error during fetchWrapper:", error);
            // 1. Si nosotros lanzamos ApiError manualmente arriba (400, 500, etc)
            if (error instanceof ApiError) {
                throw error;
            }

            // 2. Si el AbortController disparó la señal (Timeout)
            // fetch lanza un error con name 'AbortError'
            else if (error instanceof Error && error.name === "AbortError") {
                throw new TimeoutError();
            }

            // 3. Si el fetch falló por falta de internet o DNS (Network Error)
            // fetch lanza un TypeError genérico cuando no puede conectar
            else {
                // Opcional: puedes loguear el error original para debug
                throw new NetworkError();
            }
        } finally {
            clearTimeout(id); // Asegurarse de limpiar el temporizador
        }
    }

    async fetch(
        input: URL | RequestInfo,
        requestInit?: RequestInit
    ): Promise<Response> {
        const url = `${this.baseUrl}${input}`;
        return await fetch(url, requestInit);
    }

    async fetchWithAuth(
        input: URL | RequestInfo,
        requestInit?: RequestInit
    ): Promise<Response> {
        const url = `${this.baseUrl}${input}`;
        const headers = {
            ...(requestInit?.headers || {}),
            ...clientTypeHeader,
            ...(this.accessToken
                ? { Authorization: `Bearer ${this.accessToken}` }
                : {}),
        };
        const finalRequestInit = {
            ...requestInit,
            headers,
        };
        return await fetch(url, finalRequestInit);
    }

    post<R>(endpoint: string, data: any, options?: FetchOptions): Promise<R>;
    post<T, R>(endpoint: string, data: T, options?: FetchOptions): Promise<R>;
    post<R>(endpoint: string, options?: FetchOptions): Promise<R>;

    async post<T, R>(
        endpoint: string,
        data?: T | null,
        options?: FetchOptions
    ): Promise<R> {
        const body = data === undefined ? null : data;
        return this.fetchWrapper<T, R>(endpoint, body as T, "POST", options);
    }

    get<T, R>(endpoint: string, data: T, options?: FetchOptions): Promise<R>;
    get<R>(endpoint: string, data: any, options?: FetchOptions): Promise<R>;
    get<R>(endpoint: string, options?: FetchOptions): Promise<R>;

    async get<T, R>(
        endpoint: string,
        data?: T,
        options?: FetchOptions
    ): Promise<R> {
        const body = data === undefined ? null : data;
        return this.fetchWrapper<T, R>(endpoint, body as T, "GET", options);
    }

    put<R>(endpoint: string, options?: FetchOptions): Promise<R>;
    put<T, R>(endpoint: string, data: T, options?: FetchOptions): Promise<R>;
    put<R>(endpoint: string, data: any, options?: FetchOptions): Promise<R>;

    async put<T, R>(
        endpoint: string,
        data?: T,
        options?: FetchOptions
    ): Promise<R> {
        const body = data === undefined ? null : data;
        return this.fetchWrapper<T, R>(endpoint, body as T, "PUT", options);
    }

    delete<R>(endpoint: string, options?: FetchOptions): Promise<R>;
    delete<T, R>(endpoint: string, data: T, options?: FetchOptions): Promise<R>;
    delete<R>(endpoint: string, data: any, options?: FetchOptions): Promise<R>;

    async delete<T, R>(
        endpoint: string,
        data?: T,
        options?: FetchOptions
    ): Promise<R> {
        const body = data === undefined ? null : data;
        return this.fetchWrapper<T, R>(endpoint, body as T, "DELETE", options);
    }

    patch<R>(endpoint: string, options?: FetchOptions): Promise<R>;
    patch<T, R>(endpoint: string, data: T, options?: FetchOptions): Promise<R>;
    patch<R>(endpoint: string, data: any, options?: FetchOptions): Promise<R>;

    async patch<T, R>(
        endpoint: string,
        data?: T,
        options?: FetchOptions
    ): Promise<R> {
        const body = data === undefined ? null : data;
        return this.fetchWrapper<T, R>(endpoint, body as T, "PATCH", options);
    }
}

// Exportar instancia singleton
export default new ApiClient(env.apiUrl);

export { ApiClient, ApiError, TimeoutError, NetworkError, FetchOptions };
