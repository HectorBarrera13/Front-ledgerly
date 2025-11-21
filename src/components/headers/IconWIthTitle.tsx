import { View, Text, Pressable } from "react-native";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";
import { StyleSheet } from "react-native";

interface props {
    title: string;
}

export default function IconWithTitle(props: props) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <IconLedgerly />
            </View>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
        paddingVertical: 10,
    },
    iconContainer: {
        position: "absolute",
        top: 6,
        left: 25,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#7519EB",
    },
});
