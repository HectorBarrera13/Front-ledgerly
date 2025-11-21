// FriendsTopTabs.js
import React from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// 1. Define tus pantallas para los tabs (Las mismas que tenías en scan.js/generate.js)
const ScanScreen = () => (
    <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#e0f7fa",
        }}
    >
        <Text style={{ fontSize: 18 }}>Lógica para ESCANEAR QR</Text>
    </View>
);

const GenerateScreen = () => (
    <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f3e5f5",
        }}
    >
        <Text style={{ fontSize: 18 }}>Lógica para GENERAR QR</Text>
    </View>
);

const Tab = createMaterialTopTabNavigator();

// 2. Crea el componente que contiene el Top Tab Navigator
export default function FriendTopTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Scan"
            screenOptions={{
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "gray",
                tabBarIndicatorStyle: { backgroundColor: "blue" },
                tabBarStyle: { marginTop: 0 }, // Asegúrate de que no tenga márgenes innecesarios
            }}
        >
            {/* Nótese que aquí usamos nombres de componentes, no de archivos */}
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
                options={{ title: "Escanear QR" }}
            />
            <Tab.Screen
                name="Generate"
                component={GenerateScreen}
                options={{ title: "Generar QR" }}
            />
        </Tab.Navigator>
    );
}
