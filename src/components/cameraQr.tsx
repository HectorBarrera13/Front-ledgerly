import { CameraView, useCameraPermissions } from "expo-camera";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useEffect, useState } from "react";

export default function CameraQr() {
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (permission && !permission.granted) {
            setModalVisible(true);
        }
    }, [permission]);

    const handleRequestPermission = async () => {
        console.log("Solicitando permiso de cámara...");
        const result = await requestPermission();

        if (result.granted) {
            setModalVisible(false);
        }
    };

    // Si aún no se ha verificado el estado del permiso
    if (!permission) {
        return (
            <View style={styles.container}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    // Si NO tiene permisos, mostrar modal
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Permiso de Cámara</Text>
                            <Text style={styles.description}>
                                Esta aplicación necesita acceso a tu cámara para
                                escanear códigos QR.
                            </Text>

                            <Pressable
                                style={styles.button}
                                onPress={handleRequestPermission}
                            >
                                <Text style={styles.buttonText}>
                                    Permitir acceso a la cámara
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    // Si YA tiene permisos, mostrar la cámara
    return (
        <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={(data) => {
                console.log(data);
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    camera: {
        flex: 1,
        width: "100%",
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
    text: {
        fontSize: 18,
        color: "#333",
    },
    warningText: {
        marginTop: 15,
        fontSize: 14,
        color: "#75119E",
        textAlign: "center",
    },
});
