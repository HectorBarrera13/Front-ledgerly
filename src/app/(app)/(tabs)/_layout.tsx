import IconWithTitle from "@/components/headers/IconWIthTitle";
import { Tabs, usePathname } from "expo-router";

export default function TabLayout() {
    const pathname = usePathname();

    return (
        <Tabs>
            <Tabs.Screen
                name="debts"
                options={{
                    title: "Deudas",
                    headerLeft: () => <IconWithTitle title="" />,
                }}
            />
            <Tabs.Screen
                name="groups"
                options={{
                    title: "Grupos",
                    headerLeft: () => <IconWithTitle title="Grupos" />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    headerLeft: () => <IconWithTitle title="Perfil" />,
                }}
            />
            <Tabs.Screen
                name="friends"
                options={{
                    title: "Amigos",
                    headerLeft: () => <IconWithTitle title="Amigos" />,
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Notificaciones",
                    headerLeft: () => <IconWithTitle title="" />,
                }}
            />
        </Tabs>
    );
}
