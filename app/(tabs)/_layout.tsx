import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="debts" options={{ title: "Deudas" }} />
      <Tabs.Screen name="groups" options={{ title: "Grupos" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
