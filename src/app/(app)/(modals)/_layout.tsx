import { Slot, Stack } from "expo-router";

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="scanQr"
                options={{
                    headerTitleAlign: "center",
                    headerShown: true,
                    headerLeft: () => null,
                    headerRight: () => null,
                    title: "Escanear QR",
                }}
            />
        </Stack>
    );
}
