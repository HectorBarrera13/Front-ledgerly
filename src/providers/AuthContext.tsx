// context/AuthContext.tsx
import React, { createContext, useEffect, useContext, useReducer } from "react";
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

type AuthState = {
    isLoading: boolean;
    profile: Profile | null;
    initialCheckDone: boolean;
};

type AuthAction =
    | { type: "RESTORE_PROFILE"; profile: Profile | null }
    | { type: "UPDATE_PROFILE"; profile: Profile | null };

const initialState: AuthState = {
    isLoading: true,
    profile: null,
    initialCheckDone: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "RESTORE_PROFILE":
            return {
                ...state,
                profile: action.profile,
                isLoading: false,
                initialCheckDone: true,
            };
        case "UPDATE_PROFILE":
            return {
                ...state,
                profile: action.profile,
            };
        default:
            return state;
    }
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
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { profile, isLoading, initialCheckDone } = state;
    const segments = useSegments();
    const ready = useRootNavigationState();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const currentProfile = USE_MOCKED_PROFILE
                    ? MOCKED_PROFILE
                    : await authService.getSession();
                dispatch({
                    type: "RESTORE_PROFILE",
                    profile: currentProfile,
                });
            } catch (error) {
                dispatch({ type: "RESTORE_PROFILE", profile: null });
            } finally {
                SplashScreen.hideAsync().catch((err) => {
                    console.error("Error hiding splash screen:", err);
                });
            }
        }

        fetchProfile();
        if (!USE_MOCKED_PROFILE) {
            authService.onAuthStateChanged((newProfile) => {
                dispatch({
                    type: "UPDATE_PROFILE",
                    profile: newProfile,
                });
            });

            // Cleanup
            return () => {
                authService.unsubscribe();
            };
        }
    }, []);

    useEffect(() => {
        if (!ready) return;
        if (!initialCheckDone) return;

        const isRootRoute = (segments.length as number) === 0;
        const isAuthRoute = segments[0] === "(auth)";

        if (profile) {
            if (isAuthRoute || isRootRoute) {
                router.replace("/(tabs)/debts");
            }
        } else {
            if (!isAuthRoute || isRootRoute) {
                router.replace("/login");
            }
        }
    }, [initialCheckDone, profile, segments, ready]);

    return (
        <AuthContext.Provider value={{ isLoading, profile }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
