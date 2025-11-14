import { Stack } from "expo-router";

export default function DebtsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(pay-receive)" options={{ title: "Deudas" }} />
      <Stack.Screen name="create" options={{ title: "Crear deuda" }} />
      <Stack.Screen name="confirm" options={{ title: "Confirmar deuda" }} />
      <Stack.Screen name="[debtId]" options={{ title: "Detalle de deuda" }} />
    </Stack>
  );
}
