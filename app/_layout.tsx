import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [user, setUser] = useState<null | { name: string }>(null);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    // Simulación: “consultar” sesión y responder después de 1s
    const timer = setTimeout(() => {
      const fakeUser = { name: "Héctor" }; // pon null para simular sin sesión
      setUser(fakeUser);
      setReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return null; // aquí podrías poner un splash o loader
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(auth)"
        options={{}} // oculta auth cuando hay user
      />
      <Stack.Screen
        name="(tabs)"
        options={{}} // sólo disponible si hay user
      />
    </Stack>
  );
}
