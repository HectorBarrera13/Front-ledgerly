import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        animation: "slide_from_bottom",
        gestureDirection: "vertical",
        headerShown: false,
      }}>
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
