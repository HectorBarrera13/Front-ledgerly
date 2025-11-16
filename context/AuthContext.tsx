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
import { loginRequest, logoutRequest } from "@/lib/authApi";

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
      const expiresAt = data.session_expires_at;

      if (!token) throw new Error("No se recibió access_token");
      if (!expiresAt)
        throw new Error("No se recibió session_expires_at");

      setAccessToken(token);

      await AsyncStorage.setItem("access_token", token);
      await AsyncStorage.setItem("session_expires_at", expiresAt);

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
    await AsyncStorage.removeItem("session_expires_at");

    router.replace("/(auth)/login");
  };

  // -----------------------------------
  // AUTO LOGIN 
  // -----------------------------------
  const tryAutoLogin = async () => {
    const token = await AsyncStorage.getItem("access_token");
    const expiresAtString = await AsyncStorage.getItem("session_expires_at");

    if (!token || !expiresAtString) {
      setLoading(false);
      return;
    }

    const expiresAt = new Date(expiresAtString).getTime();
    const now = Date.now();

    if (now >= expiresAt) {
      console.log("Token expirado, cerrando sesión");
      await logout();
      setLoading(false);
      return;
    }

    console.log("Token válido, restaurando sesión");
    setAccessToken(token);
    router.replace("/(tabs)/debts");

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
