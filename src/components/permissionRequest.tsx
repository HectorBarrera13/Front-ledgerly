import { View, Text, Modal, Pressable } from "react-native";
import { StyleSheet } from "react-native";

interface PermissionRequestModalProps {
    onPressAllow: () => void;
    visible: boolean;
    animationType?: "slide" | "fade" | "none";
    transparent?: boolean;
    description: string;
    title: string;
    buttonText: string;
}

export default function PermissionRequestModal(
    props: PermissionRequestModalProps
) {
    return (
        <View style={styles.container}>
            <Modal
                animationType={props.animationType || "slide"}
                transparent={props.transparent || true}
                visible={props.visible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>{props.title}</Text>
                        <Text style={styles.description}>
                            {props.description}
                        </Text>

                        <Pressable
                            style={styles.button}
                            onPress={props.onPressAllow}
                        >
                            <Text style={styles.buttonText}>
                                {props.buttonText}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "85%",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 25,
        color: "#666",
        lineHeight: 22,
    },
    button: {
        backgroundColor: "#7519EB",
        borderRadius: 10,
        padding: 15,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
