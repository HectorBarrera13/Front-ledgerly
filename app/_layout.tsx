// app/_layout.tsx
import { Slot, SplashScreen } from "expo-router";
import AuthProvider from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync().catch((err) => {
    console.error("Failed to prevent auto-hide:", err);
});

export default function RootLayout() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}
