import { Stack } from "expo-router";

export default function ModalsLayout() {
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
            <Stack.Screen
                name="newDebt"
                options={{
                    headerTitleAlign: "center",
                    headerShown: false,
                    title: "Nueva Deuda",
                }}
            />
            <Stack.Screen
                name="finishDebt"
                options={{
                    headerTitleAlign: "center",
                    headerShown: false,
                    title: "Finalizar",
                }}
            />
      </Stack>
  );
}
