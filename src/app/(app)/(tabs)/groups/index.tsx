import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import GroupCard from "@/components/groups/GroupCard";
import ButtonAdd from "@/components/ButtonAdd";

export default function GroupsView() {
    const router = useRouter();

    // Grupos de ejemplo para renderizar las tarjetas
    const sampleGroups = [
        { id: '1', name: 'Viaje a CDMX', description: 'Gastos compartidos', amount: 1250 },
        { id: '2', name: 'Cena del viernes', description: 'Restaurante', amount: 850 },
        { id: '3', name: 'Regalos navideños', description: 'Colecta de regalos', amount: 2100 },
    ];

    const handleDetails = (id: string) => {
        router.push(`/(modals)/groupDetails?id=${id}`);
    };

    return (
        <View style={styles.container}>
            {sampleGroups.map((group) => (
                <GroupCard 
                    key={group.id} 
                    group={group} 
                    onPress={handleDetails}
                    style={{ marginBottom: 16 }}
                />
            ))}

            <View style={styles.addBtnContainer}>
                <ButtonAdd onPress={() => router.push('/(modals)/newGroup')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#fff",
    },
    loginButton: {
        backgroundColor: "#7B1FFF",
        borderRadius: 30,
        width: "100%",
        marginBottom: 15,
    },
    addBtnContainer: {
        position: "absolute",
        bottom: 24,
        paddingRight: 24,
        alignSelf: "flex-end",
    },
});
