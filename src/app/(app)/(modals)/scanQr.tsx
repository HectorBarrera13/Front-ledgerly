// scanQr.tsx
import { StyleSheet, Text, View } from "react-native";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";
import CameraQr from "@/components/cameraQr";
import { useEffect, useState } from "react";
import BinaryModal from "@/components/BinaryModal";
import { router } from "expo-router";
import { useQrFriendScanner } from "@/hooks/useQrFriendScanner";

export default function ScanQrView() {
    const { scanError, startScanning, resetScanning, scanned } =
        useQrFriendScanner();
    const [retryModalVisible, setRetryModalVisible] = useState(false);
    const [returnedFromBackground, setReturnedFromBackground] = useState(false);

    useEffect(() => {
        if (scanError && !retryModalVisible) {
            setRetryModalVisible(true);
        }
    }, [scanError]);

    const onRetry = () => {
        setRetryModalVisible(false);
        resetScanning();
    };

    const onCancel = () => {
        setRetryModalVisible(false);
        router.back();
    };

    const onSuccess = () => {
        router.push({
            pathname: "/friends",
            params: { reload: "true" },
        });
        setReturnedFromBackground(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View style={styles.qrCamera}>
                    {retryModalVisible ? null : (
                        <CameraQr onScan={startScanning} />
                    )}
                </View>
                <Text style={styles.instruction}>
                    ¡Escanea el QR de tus amigos para añadirlos!
                </Text>
                <IconLedgerly style={styles.icon} />
            </View>
            <BinaryModal
                visible={retryModalVisible}
                title={scanError ? scanError.title : "Error desconocido"}
                description={
                    scanError
                        ? scanError.description
                        : "Ha ocurrido un error desconocido."
                }
                buttonTextFirst="Cancelar"
                buttonTextSecond="Reintentar"
                onPressFirst={onCancel}
                onPressSecond={onRetry}
            />
            <BinaryModal
                visible={scanned && !returnedFromBackground}
                title="¡Amigo añadido!"
                description="Has añadido un nuevo amigo exitosamente."
                buttonTextFirst="Cerrar"
                buttonTextSecond="Añadir otro"
                onPressFirst={onSuccess}
                onPressSecond={onRetry}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#7519EB",
    },
    box: {
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        width: 350,
        height: 600,
    },
    qrCamera: {
        width: 300,
        height: 450,
        borderRadius: 20,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 35,
    },
    instruction: {
        fontSize: 13,
        color: "#2E2E2E",
        textAlign: "center",
        marginBottom: 30,
    },
    icon: {
        position: "absolute",
        bottom: 20,
    },
});
