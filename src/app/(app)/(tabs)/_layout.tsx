import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Deudas" }} />
            <Tabs.Screen name="groups" options={{ title: "Grupos" }} />
            <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
        </Tabs>
    );
}
