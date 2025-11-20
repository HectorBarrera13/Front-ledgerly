import { Stack } from "expo-router";

export default function PlayGroundLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="playground"
                options={{
                    headerTitle: "Playground", // Una cabecera sencilla para el playground
                }}
            />
        </Stack>
    );
}
