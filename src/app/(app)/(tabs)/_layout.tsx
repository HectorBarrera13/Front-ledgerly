import { Tabs } from "expo-router";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";
import IconFriends from "@asset/icon/icon_tab_friends.svg";
import IconProfile from "@asset/icon/icon_tab_profile.svg";
import IconDebts from "@asset/icon/icon_tab_debts.svg";
import IconNotifications from "@asset/icon/icon_tab_notifications.svg";
import IconGroups from "@asset/icon/icon_tab_groups.svg";
import { headerStyles } from "@/configs/styles";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="debts"
                options={{
                    title: "Deudas",
                    headerShown: false,
                    headerTitleStyle: {
                        ...headerStyles.title,
                        display: "none",
                    },
                    headerTitleAlign: "center",
                    headerLeft: () => (
                        <IconLedgerly style={headerStyles.headerLeft} />
                    ),
                    tabBarIcon: ({ color, size }) => (
                        <IconDebts width={size} height={size} fill={color} />
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
                    tabBarIcon: ({ color, size }) => (
                        <IconGroups width={size} height={size} fill={color} />
                    ),
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
                    tabBarIcon: ({ color, size }) => (
                        <IconNotifications width={size} height={size} fill={color} />
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
        </Tabs>
    );
}
