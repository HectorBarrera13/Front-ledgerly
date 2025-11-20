import { Stack } from "expo-router";

export default function FriendsLayout() {
    return (
        <Stack
            screenOptions={{
                presentation: "modal",
                animation: "slide_from_bottom",
                headerShown: false,
            }}
        />
    );
}
