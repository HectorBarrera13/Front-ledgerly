import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="debts" options={{ title: "Deudas" }} />
            <Tabs.Screen name="groups" options={{ title: "Grupos" }} />
            <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
            <Tabs.Screen name="friends" options={{ title: "Amigos" }} />
            <Tabs.Screen
                name="notifications"
                options={{ title: "Notificaciones" }}
            />
        </Tabs>
    );
}
