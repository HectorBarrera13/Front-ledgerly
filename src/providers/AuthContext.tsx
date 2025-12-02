// context/AuthContext.tsx
import React, { createContext, useEffect, useContext } from "react";
import { router, useRootNavigationState, useSegments } from "expo-router";
import { SplashScreen } from "expo-router";
import { authService } from "@service/authService";
import { Profile } from "@/types/LoginResponse";

type AuthData = {
    isLoading: boolean;
    profile: Profile | null;
};

const AuthContext = createContext<AuthData>({
    isLoading: true,
    profile: null,
});

interface Props {
    children: React.ReactNode;
}

const MOCKED_PROFILE: Profile = {
    account: {
        id: "account_123",
        email: "mocked@example.com",
    },
    user: {
        id: "user_123",
        firstName: "Mocked",
        lastName: "User",
        phone: "1234567890",
    },
};

const USE_MOCKED_PROFILE = false;

export default function AuthProvider(props: Props) {
    const [initialCheckDone, setInitialCheckDone] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [profile, setProfile] = React.useState<Profile | null>(null);
    const segments = useSegments();
    const ready = useRootNavigationState();

    useEffect(() => {
        setIsLoading(true);
        setInitialCheckDone(false);
        if (USE_MOCKED_PROFILE) {
            setProfile(MOCKED_PROFILE);
            setIsLoading(false);
            setInitialCheckDone(true);
            return;
        }
        const unsuscribe = authService.onAuthStateChanged((newProfile) => {
            setProfile(newProfile);
            setInitialCheckDone(true);
            setIsLoading(false);
            if (newProfile) {
                console.log("User logged in");
            } else {
                console.log("User logged out");
            }
        });
        return () => unsuscribe();
    }, []);

    useEffect(() => {
        if (!initialCheckDone || !ready) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (profile) {
            // Si está autenticado y está en auth o en la raíz, llevarlo a debts
            if (inAuthGroup || segments.length === (0 as number)) {
                router.replace("/debts");
            }
        } else {
            // Si NO está autenticado y NO está en auth, llevarlo a login
            if (!inAuthGroup) {
                router.replace("/login");
            }
        }

        // Ocultar splash screen cuando la navegación inicial esté lista
        SplashScreen.hideAsync().catch((err) => {
            console.error("Failed to hide splash screen:", err);
        });
    }, [initialCheckDone, profile, segments, ready]);

    return (
        <AuthContext.Provider value={{ isLoading, profile }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
