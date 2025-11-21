import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FriendCard from "@component/friends/friendCard";
import FriendList from "@component/friends/friendList";
import SmallModal from "@/components/modals/messageModal";
import { Button } from "@component/Button";
import { useState } from "react";
import IconWithTitle from "@/components/headers/IconWIthTitle";

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
            <Text>Playground Screen</Text>
        </SafeAreaView>
    );
}
