import { Tabs } from "expo-router";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";
import IconFriends from "@asset/icon/icon_tab_friends.svg";
import IconProfile from "@asset/icon/icon_tab_profile.svg";
import { headerStyles } from "@/configs/styles";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="debts"
                options={{
                    title: "Deudas",
                    headerTitleStyle: {
                        ...headerStyles.title,
                        display: "none",
                    },
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <IconLedgerly style={headerStyles.headerLeft} />
                    ),
                    tabBarActiveTintColor: "#7519EB",
                }}
            />
            <Tabs.Screen
                name="groups"
                options={{
                    title: "Grupos",
                    headerTitleStyle: headerStyles.title,
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <IconLedgerly style={headerStyles.headerLeft} />
                    ),
                    tabBarActiveTintColor: "#7519EB",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    headerTitleStyle: headerStyles.title,
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <IconLedgerly style={headerStyles.headerLeft} />
                    ),
                    tabBarIcon: () => <IconProfile />,
                    tabBarActiveTintColor: "#7519EB",
                }}
            />
            <Tabs.Screen
                name="friends"
                options={{
                    title: "Amigos",
                    headerTitleStyle: headerStyles.title,
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <IconLedgerly style={headerStyles.headerLeft} />
                    ),
                    tabBarIcon: () => <IconFriends />,
                    tabBarActiveTintColor: "#7519EB",
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Notificaciones",
                    headerTitleStyle: {
                        ...headerStyles.title,
                        display: "none",
                    },
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <IconLedgerly style={headerStyles.headerLeft} />
                    ),
                    tabBarActiveTintColor: "#7519EB",
                }}
            />
        </Tabs>
    );
}
