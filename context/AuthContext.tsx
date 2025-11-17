// context/AuthContext.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { loginRequest, logoutRequest } from "@/services/authApi";

type AuthContextType = {
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    error: string | null;
};

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    login: async () => {},
    logout: async () => {},
    loading: true,
    error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // -----------------------------------
    // LOGIN
    // -----------------------------------
    const login = async (email: string, password: string) => {
        setError(null);

        try {
            const data = await loginRequest(email, password);

            const token = data.access_token;
            if (!token) throw new Error("No se recibió access_token");

            setAccessToken(token);
            await AsyncStorage.setItem("access_token", token);

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
        await AsyncStorage.removeItem("access_token");
        router.replace("/(auth)/login");
    };

    // -----------------------------------
    // AUTO LOGIN
    // -----------------------------------
    const tryAutoLogin = async () => {
        const token = await AsyncStorage.getItem("access_token");

        if (token) {
            setAccessToken(token);
            router.replace("/(tabs)/debts");
        }

        setLoading(false);
    };

    useEffect(() => {
        tryAutoLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{ accessToken, login, logout, loading, error }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
