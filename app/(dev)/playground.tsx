import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FriendCard from "@/components/friends/friendCard";
import FriendList from "@/components/friends/friendList";
import AddFriendBar from "@/components/friends/addFriendBar";
import SmallModal from "../modals/messageModal";
import { Button } from "@/components/Button";
import { useState } from "react";

export default function Playground() {
    const [modalVisible, setModalVisible] = useState(false);

    const data = [
        {
            id: "1",
            firstName: "Test",
            lastName: "User",
            phone: "000-000-0000",
            addedAt: "2024-01-01T00:00:00Z",
        },
        {
            id: "2",
            firstName: "Sample",
            lastName: "Person",
            phone: "111-111-1111",
            addedAt: "2024-02-02T00:00:00Z",
        },
        {
            id: "3",
            firstName: "Example",
            lastName: "Individual",
            phone: "222-222-2222",
            addedAt: "2024-03-03T00:00:00Z",
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 22, marginBottom: 20 }}>
                Playground de componentes
            </Text>
            <Text style={{ marginBottom: 10 }}>FriendCard ejemplo:</Text>
            <FriendCard
                friend={{
                    id: "123",
                    firstName: "Jane",
                    lastName: "Smith",
                    phone: "987-654-3210",
                    addedAt: "2024-06-01T12:00:00Z",
                }}
                onRemove={() => console.log("Remove pressed")}
                onPress={() => console.log("Card pressed")}
            />
            <Text style={{ marginTop: 20 }}> FriendList ejemplo:</Text>
            <FriendList
                friends={data}
                onRemove={(id) => console.log("Remove pressed", id)}
                onPress={(id) => console.log("Card pressed", id)}
            />
            <Text style={{ marginTop: 20 }}> AddFriendBar ejemplo:</Text>
            <AddFriendBar
                onPressGenerateQr={() => console.log("Generar QR pressed")}
                onPressScanQr={() => console.log("Escanear QR pressed")}
            />
            <Text style={{ marginTop: 20 }}> SmallModal ejemplo:</Text>
            <SmallModal
                title="Aviso"
                text="Esta es una alerta pequeña"
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            <Button
                title="Botón de ejemplo"
                onPress={() => setModalVisible(true)}
            />
        </SafeAreaView>
    );
}
