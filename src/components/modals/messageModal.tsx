import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SmallModalProps {
    title: string;
    text: string;
    visible: boolean;
    onClose: () => void;
}

export default function SmallModal({
    title,
    text,
    visible,
    onClose,
}: SmallModalProps) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.body}>{text}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },
    body: {
        fontSize: 15,
        marginBottom: 20,
    },
    button: {
        alignSelf: "flex-end",
    },
    buttonText: {
        color: "#007AFF",
        fontWeight: "600",
    },
});
