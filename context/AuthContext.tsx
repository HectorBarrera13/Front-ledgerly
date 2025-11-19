// context/AuthContext.tsx
import React, { createContext, useEffect, useContext, useReducer } from "react";
import { router, useRootNavigationState, useSegments } from "expo-router";
import { SplashScreen } from "expo-router";

import { Session } from "@/services/authService";
import { authService } from "@/services/authService";

type AuthData = {
    isLoading: boolean;
    session: Session | null;
};

const AuthContext = createContext<AuthData>({
    isLoading: true,
    session: null,
});

interface Props {
    children: React.ReactNode;
}

type AuthState = {
    isLoading: boolean;
    session: Session | null;
    initialCheckDone: boolean;
};

type AuthAction =
    | { type: "RESTORE_SESSION"; session: Session | null }
    | { type: "UPDATE_SESSION"; session: Session | null };

const initialState: AuthState = {
    isLoading: true,
    session: null,
    initialCheckDone: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "RESTORE_SESSION":
            return {
                ...state,
                session: action.session,
                isLoading: false,
                initialCheckDone: true,
            };
        case "UPDATE_SESSION":
            return {
                ...state,
                session: action.session,
            };
        default:
            return state;
    }
}

export default function AuthProvider(props: Props) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { session, isLoading, initialCheckDone } = state;
    const segments = useSegments();
    const ready = useRootNavigationState();

    useEffect(() => {
        async function fetchSession() {
            try {
                const currentSession = await authService.getSession();
                dispatch({
                    type: "RESTORE_SESSION",
                    session: currentSession,
                });
            } catch (error) {
                console.error("Error fetching session:", error);
                dispatch({ type: "RESTORE_SESSION", session: null });
            } finally {
                SplashScreen.hideAsync().catch((err) => {
                    console.error("Error hiding splash screen:", err);
                });
            }
        }

        fetchSession();

        authService.onAuthStateChanged((newSession) => {
            dispatch({ type: "UPDATE_SESSION", session: newSession });
        });

        // Cleanup
        return () => {
            authService.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!ready) return;
        if (!initialCheckDone) return;

        const isRootRoute = (segments.length as number) === 0;
        const isAuthRoute = segments[0] === "(auth)";

        if (session) {
            if (isAuthRoute || isRootRoute) {
                router.replace("/(tabs)/debts");
            }
        } else {
            if (!isAuthRoute || isRootRoute) {
                router.replace("/(auth)/login");
            }
        }
    }, [initialCheckDone, session, segments, ready]);

    return (
        <AuthContext.Provider value={{ isLoading, session }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
