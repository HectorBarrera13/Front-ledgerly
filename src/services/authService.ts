import { Profile } from "@type/LoginResponse";
import apiClient, {
    ApiClient,
    ApiError,
    NetworkError,
    TimeoutError,
} from "@service/apiClient";
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


type AuthStateCallback = (session: Profile | null) => void;

const REFRESH_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes

export class AuthService {
    private api: ApiClient;
    private profile: Profile | null = null;
    private accessToken: string | null = null;
    private accessTokenExpiresAt: number | null = null;
    private refreshToken: string | null = null;
    private refreshTimeoutId: NodeJS.Timeout | null = null;
    private authStateListeners: Set<AuthStateCallback> = new Set();

    private readonly STORAGE_KEYS = {
        ACCESS_TOKEN: "auth_access_token",
        REFRESH_TOKEN: "auth_refresh_token",
        ACCESS_TOKEN_EXPIRES_AT: "auth_access_token_expires_at",
        PROFILE: "auth_profile",
    };

    constructor(apiClient: ApiClient) {
        this.api = apiClient;
        this.initialize();
    }

    private async initialize() {
        try {
            const accessToken = await AsyncStorage.getItem(
                this.STORAGE_KEYS.ACCESS_TOKEN
            );
            const refreshToken = await AsyncStorage.getItem(
                this.STORAGE_KEYS.REFRESH_TOKEN
            );
            const expiresAt = await AsyncStorage.getItem(
                this.STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT
            );
            const profile = await AsyncStorage.getItem(
                this.STORAGE_KEYS.PROFILE
            );

            if (accessToken && refreshToken && expiresAt && profile) {
                this.accessToken = accessToken;
                this.refreshToken = refreshToken;
                this.accessTokenExpiresAt = parseInt(expiresAt, 10);
                this.profile = JSON.parse(profile);

                this.api.setAccessToken(this.accessToken);

                if (this.isTokenExpiringSoon()) {
                    this.refreshAccessToken();
                } else {
                    this.scheduleTokenRefresh();
                }

                this.notifyAuthStateChanged();
            }
        } catch (error) {
            console.error("Failed to initialize AuthService:", error);
            this.clearSession();
        }
    }

    private async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            this.clearSession();
            return;
        }
        try {
            const response = await this.api.post<RefreshResponse>(
                "/auth/refresh",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${this.refreshToken}`,
                    },
                }
            );
            this.accessToken = response.accessToken;
            this.accessTokenExpiresAt = new Date(response.expiresAt).getTime();
            const actualAuth: AuthResponse = {
                account: this.profile!.account,
                user: this.profile!.user,
                token: {
                    accessToken: this.accessToken,
                    expiresAt: new Date(
                        this.accessTokenExpiresAt!
                    ).toISOString(),
                    refreshToken: this.refreshToken!,
                },
            };
            await this.setSession(actualAuth);
        } catch (error) {
            if (
                error instanceof NetworkError ||
                error instanceof TimeoutError ||
                (error instanceof ApiError && error.status === 400)
            ) {
                setTimeout(() => {
                    this.refreshAccessToken();
                }, 10000); // Retry after 10 seconds
            } else {
                this.clearSession();
            }
        }
    }

    private async clearSession(): Promise<void> {
        this.profile = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.accessTokenExpiresAt = null;

        try {
            await Promise.all([
                AsyncStorage.removeItem(this.STORAGE_KEYS.ACCESS_TOKEN),
                AsyncStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN),
                AsyncStorage.removeItem(
                    this.STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT
                ),
                AsyncStorage.removeItem(this.STORAGE_KEYS.PROFILE),
            ]);

            this.api.removeAccessToken();

            if (this.refreshTimeoutId) {
                clearTimeout(this.refreshTimeoutId);
                this.refreshTimeoutId = null;
            }

            this.notifyAuthStateChanged();
        } catch (error) {
            throw new AuthError("Failed to clear session", "STORAGE_ERROR");
        }
    }

    private async setSession(data: AuthResponse): Promise<void> {
        this.profile = {
            account: data.account,
            user: data.user,
        };
        this.accessToken = data.token.accessToken;
        this.refreshToken = data.token.refreshToken;
        this.accessTokenExpiresAt = new Date(data.token.expiresAt).getTime();

        try {
            await Promise.all([
                AsyncStorage.setItem(
                    this.STORAGE_KEYS.ACCESS_TOKEN,
                    this.accessToken
                ),
                AsyncStorage.setItem(
                    this.STORAGE_KEYS.REFRESH_TOKEN,
                    this.refreshToken
                ),
                AsyncStorage.setItem(
                    this.STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT,
                    this.accessTokenExpiresAt.toString()
                ),
                AsyncStorage.setItem(
                    this.STORAGE_KEYS.PROFILE,
                    JSON.stringify(this.profile)
                ),
            ]);

            this.api.setAccessToken(this.accessToken);
            this.scheduleTokenRefresh();
            this.notifyAuthStateChanged();
        } catch (error) {
            this.clearSession();
            throw new AuthError("Failed to set session", "STORAGE_ERROR");
        }
    }

    private isTokenExpired(): boolean {
        if (!this.accessTokenExpiresAt) return true;
        return Date.now() > this.accessTokenExpiresAt;
    }

    private isTokenExpiringSoon(): boolean {
        if (!this.accessTokenExpiresAt) return true;
        return (
            Date.now() + REFRESH_THRESHOLD_MS >
            this.accessTokenExpiresAt - REFRESH_THRESHOLD_MS
        );
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
                this.refreshAccessToken();
            }, timeUntilRefresh);
        } else {
            this.refreshAccessToken();
        }
    }

    onAuthStateChanged(callback: AuthStateCallback): () => void {
        this.authStateListeners.add(callback);
        const currentSession = this.getSession();
        callback(currentSession);

        return () => {
            this.authStateListeners.delete(callback);
        };
    }

    private notifyAuthStateChanged(): void {
        this.authStateListeners.forEach((callback) => {
            try {
                callback(this.getSession());
            } catch (error) {
                console.error("Error in auth state listener:", error);
            }
        });
    }

    unsubscribe(): void {
        this.authStateListeners.clear();
        if (this.refreshTimeoutId) {
            clearTimeout(this.refreshTimeoutId);
            this.refreshTimeoutId = null;
        }
    }

    getSession(): Profile | null {
        if (
            !this.profile ||
            !this.accessToken ||
            !this.refreshToken ||
            !this.accessTokenExpiresAt
        ) {
            return null;
        }

        return this.profile;
    }

    isAuthenticated(): boolean {
        return (
            this.profile !== null &&
            this.accessToken !== null &&
            !this.isTokenExpired()
        );
    }

    async signUp(data: SignUpData): Promise<void> {
        try {
            const response = await this.api.post<SignUpData, AuthResponse>(
                "/auth/register",
                data
            );
            await this.setSession(response);
            return;
        } catch (error: any) {
            throw new AuthError(
                error.message || "Error al registrar usuario",
                "SIGNUP_ERROR",
                error.status
            );
        }
    }

    async signIn(email: string, password: string): Promise<void> {
        try {
            const response = await this.api.post<AuthResponse>("/auth/login", {
                email,
                password,
            });
            await this.setSession(response);
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
            // Intenta invalidar el token en el servidor
            if (this.refreshToken) {
                await this.api.post<void>("/auth/logout", {
                    refreshToken: this.refreshToken,
                });
            }
        } catch (error) {
            console.error("Error al cerrar sesión en el servidor:", error);
        } finally {
            this.clearSession();
        }
    }

    async updateProfile(updatedData: Partial<Profile>): Promise<Profile> {
        if (!this.isAuthenticated() || !this.profile) {
            throw new AuthError("Usuario no autenticado", "NOT_AUTHENTICATED");
        }

        try {
            const response = await this.api.patch<Profile>("/auth/profile");
            this.profile = response;
            await AsyncStorage.setItem(
                this.STORAGE_KEYS.PROFILE,
                JSON.stringify(this.profile)
            );
            this.notifyAuthStateChanged();
            return response;
        } catch (error: any) {
            throw new AuthError(
                error.message || "Error al actualizar el perfil",
                "UPDATE_PROFILE_ERROR",
                error.status
            );
        }
    }


    async newDebtQuick(data: NewDebtPayload): Promise<void> {
        try {
            await this.api.post("/quick-debt", data);
        } catch (error: any) {
            throw new AuthError(
                error.message || "Error al crear la deuda",
                "NEW_DEBT_ERROR",
                error.status
            );
        }
    }

    async newDebtBetweenUsers(data: NewDebtPayload): Promise<void> {
        try {
            await this.api.post("/debts-between-users", data);
        } catch (error: any) {
            throw new AuthError(
                error.message || "Error al crear la deuda entre usuarios",
                "NEW_DEBT_BETWEEN_USERS_ERROR",
                error.status
            );
        }
    }
}

export const authService = new AuthService(apiClient);
