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
                name="confirmDebt"
                options={{
                    headerTitleAlign: "center",
                    headerShown: false,
                    title: "Finalizar",
                }}
            />
            <Stack.Screen
                name="debtDetails"
                options={{
                    headerTitleAlign: "center",
                    headerShown: false,
                    title: "Detalles de la Deuda",
                }}
            />
            <Stack.Screen
                name="successNotification"
                options={{
                    headerTitleAlign: "center",
                    headerShown: false,
                    title: "Notificación de Éxito",
                }}
            />
            <Stack.Screen
                name="editDebt"
                options={{
                    headerTitleAlign: "center",
                    headerShown: false,
                    title: "Editar Deuda",
                }}
            />
            <Stack.Screen
                name="groupDetails"
                options={{
                    headerTitleAlign: "center",
                    headerShown: false,
                    title: "Detalles del Grupo",
                }}
            />
            <Stack.Screen
                name="generateQr"
                options={{
                    headerTitleAlign: "center",
                    headerShown: true,
                    title: "Código QR",
                }}
            />
        </Stack>
    );
}
