import {
    BarcodeScanningResult,
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { useEffect, useState } from "react";
import PermissionRequestModal from "./permissionRequest";

interface CameraQrProps {
    onScan: (result: BarcodeScanningResult) => void;
}

export default function CameraQr(props: CameraQrProps) {
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
            <PermissionRequestModal
                visible={modalVisible}
                onPressAllow={handleRequestPermission}
                title="Permiso de Cámara"
                description="Esta aplicación necesita acceso a tu cámara para escanear códigos QR."
                buttonText="Permitir acceso a la cámara"
            />
        );
    }

    // Si YA tiene permisos, mostrar la cámara
    return (
        <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={props.onScan}
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
});
