import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    loginRequest,
    logoutRequest,
    refreshTokenRequest,
    registerRequest,
} from "@/services/authApi";
import { User } from "@/types/User";
import { Account } from "@/types/Account";

type AuthContextType = {
    accessToken: string | null;
    user: User | null;
    account: Account | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (
        first_name: string,
        last_name: string,
        email: string,
        password: string,
        phone: { country_code: string; number: string }
    ) => Promise<void>;
    loading: boolean;
    error: string | null;
};

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    user: null,
    account: null,
    login: async () => {},
    logout: async () => {},
    register: async () => {},
    loading: true,
    error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState<
        string | null
    >(null);
    const [user, setUser] = useState<User | null>(null);
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // -----------------------------------
    // LOGIN
    // -----------------------------------
    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const data = await loginRequest(email, password);

            const { accessToken, expiresAt, refreshToken } = data.token;

            if (!accessToken) throw new Error("No se recibió accessToken");
            if (!expiresAt) throw new Error("No se recibió expiresAt");
            if (!refreshToken) throw new Error("No se recibió refreshToken");
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setAccessTokenExpiresAt(expiresAt);
            setUser(data.user);
            setAccount(data.account);

            await AsyncStorage.setItem("access_token", accessToken);
            await AsyncStorage.setItem("refresh_token", refreshToken);
            await AsyncStorage.setItem("access_token_expires_at", expiresAt);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("account", JSON.stringify(data.account));

            router.replace("/(tabs)/debts");
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // -----------------------------------
    // LOGOUT
    // -----------------------------------
    const logout = async () => {
        try {
            if (accessToken) {
                await logoutRequest(accessToken);
            }
        } catch (error) {
            console.log("Error en logout:", error);
        }

        setAccessToken(null);
        setRefreshToken(null);
        setAccessTokenExpiresAt(null);
        setUser(null);
        setAccount(null);

        await AsyncStorage.multiRemove([
            "access_token",
            "refresh_token",
            "access_token_expires_at",
            "user",
            "account",
        ]);

        router.replace("/(auth)/login");
    };

    // -----------------------------------
    // REGISTER
    // -----------------------------------
    const register = async (
        first_name: string,
        last_name: string,
        email: string,
        password: string,
        phone: { country_code: string; number: string }
    ) => {
        setError(null);
        try {
            const data = await registerRequest(
                first_name,
                last_name,
                email,
                password,
                phone
            );

            const { access_token, expires_at, refresh_token } = data.token;

            if (!access_token) throw new Error("No se recibió access_token");
            if (!expires_at) throw new Error("No se recibió expires_at");
            if (!refresh_token) throw new Error("No se recibió refresh_token");

            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            setAccessTokenExpiresAt(expires_at);
            setUser(data.user);
            setAccount(data.account);

            await AsyncStorage.setItem("access_token", access_token);
            await AsyncStorage.setItem("refresh_token", refresh_token);
            await AsyncStorage.setItem("access_token_expires_at", expires_at);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("account", JSON.stringify(data.account));

            router.replace("/(tabs)/debts");
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // -----------------------------------
    // REFRESH TOKEN
    // -----------------------------------
    const tryRefreshToken = async (storedRefreshToken: string) => {
        try {
            const data = await refreshTokenRequest(storedRefreshToken);
            console.log("REFRESH DATA:", data); 
            setAccessToken(data.access_token);
            setAccessTokenExpiresAt(data.expires_at);
            await AsyncStorage.setItem("access_token", data.access_token);
            await AsyncStorage.setItem(
                "access_token_expires_at",
                data.expires_at
            );
            return true;
        } catch (err) {
            await logout();
            return false;
        }
    };

    // -----------------------------------
    // AUTO LOGIN
    // -----------------------------------
    const tryAutoLogin = async () => {
        const [
            token,
            refreshTokenStored,
            expiresAtString,
            userString,
            accountString,
        ] = await Promise.all([
            AsyncStorage.getItem("access_token"),
            AsyncStorage.getItem("refresh_token"),
            AsyncStorage.getItem("access_token_expires_at"),
            AsyncStorage.getItem("user"),
            AsyncStorage.getItem("account"),
        ]);

        if (!refreshTokenStored) {
            setLoading(false);
            return;
        }

        let validToken = token;
        let validExpiresAt = expiresAtString;

        if (token && expiresAtString) {
            const expiresAt = new Date(expiresAtString).getTime();
            const now = Date.now();

            if (now >= expiresAt) {
                const refreshed = await tryRefreshToken(refreshTokenStored);
                if (!refreshed) {
                    setLoading(false);
                    return;
                }
                validToken = await AsyncStorage.getItem("access_token");
                validExpiresAt = await AsyncStorage.getItem(
                    "access_token_expires_at"
                );
            }
        } else {
            const refreshed = await tryRefreshToken(refreshTokenStored);
            if (!refreshed) {
                setLoading(false);
                return;
            }
            validToken = await AsyncStorage.getItem("access_token");
            validExpiresAt = await AsyncStorage.getItem(
                "access_token_expires_at"
            );
        }

        setAccessToken(validToken);
        setRefreshToken(refreshTokenStored);
        setAccessTokenExpiresAt(validExpiresAt);

        if (userString) setUser(JSON.parse(userString));
        if (accountString) setAccount(JSON.parse(accountString));

        router.replace("/(tabs)/debts");
        setLoading(false);
    };

    useEffect(() => {
        tryAutoLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                user,
                account,
                login,
                logout,
                register,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
