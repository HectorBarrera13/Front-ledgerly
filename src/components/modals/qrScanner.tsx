import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import SmallModal from "./messageModal";
import { useFriends } from "@hook/useFriends";

export default function QrScannerModal() {
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);
    const [scanned, setScanned] = useState(false);
    const { addFriend, error } = useFriends();

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View>
                <Text>Necesitas dar permiso a la cámara</Text>
                <Button title="Dar permiso" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={(data) => {
                    if (scanned || modalVisible) return;
                    if (data?.data) {
                        {
                            setScanned(true);
                            addFriend(data.data);
                            setModalVisible(true);
                        }
                    }
                }}
            />
            <SmallModal
                title={error ? "Error de escaneo" : "Escaneo exitoso"}
                text={
                    error ? `Error: ${error}` : "Amigo agregado correctamente"
                }
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    router.back();
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        width: "100%",
        height: "auto",
        alignSelf: "center",
    },
});
