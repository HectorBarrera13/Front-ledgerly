import IconWithTitle from "@/components/headers/IconWIthTitle";
import { Tabs, usePathname } from "expo-router";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";

export default function TabLayout() {
    const pathname = usePathname();

    return (
        <Tabs>
            <Tabs.Screen
                name="debts"
                options={{
                    title: "",
                    headerTitleStyle: { fontSize: 20, color: "#7519EB" },
                    headerLeft: () => <IconLedgerly style={{ marginLeft: 30 }} />,
                }}
            />
            <Tabs.Screen
                name="groups"
                options={{
                    title: "Grupos",
                    headerTitleStyle: { fontSize: 20, color: "#7519EB" },
                    headerLeft: () => <IconLedgerly style={{ marginLeft: 30 }} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    headerTitleStyle: { fontSize: 20, color: "#7519EB" },
                    headerLeft: () => <IconLedgerly style={{ marginLeft: 30 }} />,
                }}
            />
            <Tabs.Screen
                name="friends"
                options={{
                    title: "Amigos",
                    headerTitleStyle: { fontSize: 20, color: "#7519EB" },
                    headerLeft: () => <IconLedgerly style={{ marginLeft: 30 }} />,
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Notificaciones",
                    headerTitleStyle: { fontSize: 20, color: "#7519EB" },
                    headerLeft: () => <IconLedgerly style={{ marginLeft: 30 }} />,
                }}
            />
        </Tabs>
    );
}
