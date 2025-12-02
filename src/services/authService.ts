import { Profile } from "@type/LoginResponse";
import apiClient, { ApiClient } from "@service/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "@type/Account";
import { User } from "@type/User";
import { Token } from "@type/Token";

export class AuthError extends Error {
    constructor(
        message: string,
        public code: string,
        public status?: number
    ) {
        super(message);
        this.name = "AuthError";
    }
}

export interface AuthResponse {
    account: Account;
    user: User;
    token: Token;
}

export interface RefreshResponse {
    accessToken: string;
    expiresAt: string;
}

export interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: {
        countryCode: string;
        number: string;
    };
}

export interface Session {
    profile: Profile;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface NewDebtPayload {
    purpose: string;
    description?: string | null;
    currency: string;
    amount: number;
    myRole: "CREDITOR" | "DEBTOR";
    targetUserName: string;
}

const REFRESH_THRESHOLD_MS = 1 * 60 * 1000; // 1 minute

export class AuthService {
    private api: ApiClient;
    private profile: Profile | null = null;
    private accessToken: string | null = null;
    private accessTokenExpiresAt: number | null = null;
    private refreshPromise: Promise<void> | null = null;
    private refreshTimeoutId: NodeJS.Timeout | null = null;
    private authStateListeners: Set<(profile: Profile | null) => void> =
        new Set();

    private readonly STORAGE_KEYS = {
        ACCESS_TOKEN: "auth_access_token",
        REFRESH_TOKEN: "auth_refresh_token",
        ACCESS_TOKEN_EXPIRES_AT: "auth_access_token_expires_at",
        PROFILE: "auth_profile",
    };

    constructor(apiClient: ApiClient) {
        this.api = apiClient;
        this.api.setRefreshHook(() => this.handleUnauthorizedAndRetry());
        this.loadInitialSession();
    }

    public onAuthStateChanged(
        callback: (profile: Profile | null) => void
    ): () => void {
        this.authStateListeners.add(callback);
        callback(this.profile);
        return () => {
            this.authStateListeners.delete(callback);
        };
    }

    private notifyAuthStateChanged(): void {
        this.authStateListeners.forEach((callback) => {
            try {
                callback(this.profile);
            } catch (error) {
                console.error("Error in auth state listener:", error);
            }
        });
    }

    private async loadInitialSession() {
        try {
            await this.loadStoredSession();
            if (this.accessToken && this.accessTokenExpiresAt) {
                this.scheduleTokenRefresh();
            }
        } catch (error) {
            console.warn("Failed to load initial session:", error);
        } finally {
            this.notifyAuthStateChanged();
        }
    }

    private async handleUnauthorizedAndRetry(): Promise<boolean> {
        if (this.refreshPromise) {
            try {
                await this.refreshPromise;
                return true;
            } catch (error) {
                console.warn(
                    "Error while waiting for ongoing token refresh:",
                    error
                );
                return false;
            }
        }

        this.refreshPromise = new Promise<void>(async (resolve, reject) => {
            try {
                const refreshToken = await AsyncStorage.getItem(
                    this.STORAGE_KEYS.REFRESH_TOKEN
                );
                if (!refreshToken) {
                    console.error(
                        "No refresh token available for token refresh"
                    );
                    throw new AuthError(
                        "No refresh token available",
                        "NO_REFRESH_TOKEN",
                        401
                    );
                }
                const response = await this.api.fetch("/auth/refresh", {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                    method: "POST",
                });

                if (!response.ok) {
                    throw new AuthError(
                        `Failed to refresh token: ${response.statusText}`,
                        "REFRESH_FAILED",
                        response.status
                    );
                }

                const data = await response.json();
                const tokenData: RefreshResponse = {
                    accessToken: data.access_token,
                    expiresAt: data.expires_at,
                };

                await this.setSession(
                    tokenData.accessToken,
                    new Date(tokenData.expiresAt).getTime(),
                    refreshToken
                );
                resolve();
            } catch (error) {
                console.error("Error during token refresh:", error);
                const isPermanent =
                    error instanceof AuthError &&
                    (error.status === 400 ||
                        error.status === 401 ||
                        error.status === 403);
                if (isPermanent) {
                    console.error(
                        "Permanent error during token refresh:",
                        error
                    );
                    await this.clearSession();
                }
                reject(error);
            } finally {
                this.refreshPromise = null;
            }
        });

        try {
            await this.refreshPromise;
            return true;
        } catch (error) {
            return false;
        }
    }

    private scheduleTokenRefresh(): void {
        if (this.refreshTimeoutId) {
            clearTimeout(this.refreshTimeoutId);
        }
        if (!this.accessTokenExpiresAt) return;

        const timeUntilRefresh =
            this.accessTokenExpiresAt - Date.now() - REFRESH_THRESHOLD_MS;

        if (timeUntilRefresh > 0) {
            this.refreshTimeoutId = setTimeout(() => {
                this.handleUnauthorizedAndRetry();
            }, timeUntilRefresh);
        }
    }

    private async loadStoredSession(): Promise<void> {
        try {
            const profile = await AsyncStorage.getItem(
                this.STORAGE_KEYS.PROFILE
            );
            const accessToken = await AsyncStorage.getItem(
                this.STORAGE_KEYS.ACCESS_TOKEN
            );
            const expiresAt = await AsyncStorage.getItem(
                this.STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT
            );
            if (profile && accessToken && expiresAt) {
                this.profile = JSON.parse(profile);
                this.accessToken = accessToken;
                this.accessTokenExpiresAt = parseInt(expiresAt, 10);
                this.api.setAccessToken(
                    this.accessToken,
                    this.accessTokenExpiresAt
                );
            }
        } catch (error) {
            console.error("Failed to load stored session:", error);
            throw new AuthError(
                "Failed to load stored session",
                "STORAGE_ERROR"
            );
        }
    }

    private async clearSession(): Promise<void> {
        try {
            await Promise.all([
                AsyncStorage.removeItem(this.STORAGE_KEYS.ACCESS_TOKEN),
                AsyncStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN),
                AsyncStorage.removeItem(
                    this.STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT
                ),
                AsyncStorage.removeItem(this.STORAGE_KEYS.PROFILE),
            ]);
            this.profile = null;
            this.accessToken = null;
            this.accessTokenExpiresAt = null;
            this.api.setAccessToken("", 0);
            if (this.refreshTimeoutId) {
                clearTimeout(this.refreshTimeoutId);
                this.refreshTimeoutId = null;
            }
            this.notifyAuthStateChanged();
        } catch (error) {
            throw new AuthError("Failed to clear session", "STORAGE_ERROR");
        }
    }

    private async setSession(
        accessToken: string,
        expiresAt: number,
        refreshToken: string,
        profile?: Profile
    ): Promise<void> {
        try {
            await Promise.all([
                AsyncStorage.setItem(
                    this.STORAGE_KEYS.ACCESS_TOKEN,
                    accessToken
                ),
                AsyncStorage.setItem(
                    this.STORAGE_KEYS.REFRESH_TOKEN,
                    refreshToken
                ),
                AsyncStorage.setItem(
                    this.STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT,
                    expiresAt.toString()
                ),
            ]);
            if (profile) {
                await AsyncStorage.setItem(
                    this.STORAGE_KEYS.PROFILE,
                    JSON.stringify(profile)
                );
                this.profile = profile;
            }
            this.accessToken = accessToken;
            this.accessTokenExpiresAt = expiresAt;
            this.api.setAccessToken(
                this.accessToken,
                this.accessTokenExpiresAt
            );
            this.scheduleTokenRefresh();
            this.notifyAuthStateChanged();
        } catch (error) {
            console.error("Failed to set session in authService:", error);
            throw new AuthError("Failed to set session", "STORAGE_ERROR");
        }
    }

    getSession(): Profile | null {
        return this.profile;
    }

    async signUp(data: SignUpData): Promise<Profile | null> {
        try {
            const response = await this.api.post<SignUpData, AuthResponse>(
                "/auth/register",
                data
            );
            await this.setSession(
                response.token.accessToken,
                new Date(response.token.expiresAt).getTime(),
                response.token.refreshToken,
                {
                    user: response.user,
                    account: response.account,
                }
            );
            return this.profile;
        } catch (error: any) {
            throw new AuthError(
                error.message || "Error al registrar usuario",
                "SIGNUP_ERROR",
                error.status
            );
        }
    }

    async signIn(email: string, password: string): Promise<Profile | null> {
        try {
            const response = await this.api.post<AuthResponse>("/auth/login", {
                email,
                password,
            });
            await this.setSession(
                response.token.accessToken,
                new Date(response.token.expiresAt).getTime(),
                response.token.refreshToken,
                {
                    user: response.user,
                    account: response.account,
                }
            );
            return this.profile;
        } catch (error: any) {
            throw new AuthError(
                error.message || "Error al iniciar sesión",
                "SIGNIN_ERROR",
                error.status
            );
        }
    }

    async signOut(): Promise<void> {
        try {
            const refreshToken = await AsyncStorage.getItem(
                this.STORAGE_KEYS.REFRESH_TOKEN
            );
            if (refreshToken) {
                await this.api.fetch("/auth/logout", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });
            }
        } catch (error) {
            console.error("Error al cerrar sesión en el servidor:", error);
        } finally {
            await this.clearSession();
            this.notifyAuthStateChanged();
        }
    }
}

export const authService = new AuthService(apiClient);
