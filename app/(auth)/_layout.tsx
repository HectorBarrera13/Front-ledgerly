import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false, // Oculta la cabecera
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerTitle: "Crear Cuenta", // Una cabecera sencilla para el registro
        }}
      />
    </Stack>
  );
}
