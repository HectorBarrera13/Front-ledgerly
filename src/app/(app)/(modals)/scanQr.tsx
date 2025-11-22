// scanQr.tsx
import { StyleSheet, Text, View } from "react-native";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";
import CameraQr from "@/components/cameraQr";
import { useQrFriend } from "@/hooks/useQrFriend";
import { useEffect, useState } from "react";
import BinaryModal from "@/components/BinaryModal";
import { router } from "expo-router";

export default function ScanQrView() {
    const {
        scanning,
        qrResult,
        error,
        startScanning,
        addFriendFromQr,
        resetScanning,
    } = useQrFriend();
    const [retryModalVisible, setRetryModalVisible] = useState(false);

    useEffect(() => {
        if (scanning && qrResult) {
            addFriendFromQr();
        }
    }, [qrResult]);

    useEffect(() => {
        if (error && !retryModalVisible) {
            setRetryModalVisible(true);
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View style={styles.qrCamera}>
                    <CameraQr onScan={startScanning} />
                </View>
                <Text style={styles.instruction}>
                    ¡Escanea el QR de tus amigos para añadirlos!
                </Text>
                <IconLedgerly style={styles.icon} />
            </View>
            <BinaryModal
                visible={retryModalVisible}
                title={error ? error.title : "Error desconocido"}
                description={
                    error
                        ? error.description
                        : "Ha ocurrido un error desconocido."
                }
                buttonTextFirst="Cancelar"
                buttonTextSecond="Reintentar"
                onPressFirst={() => {
                    setRetryModalVisible(false);
                    router.back();
                }}
                onPressSecond={() => {
                    setRetryModalVisible(false);
                    resetScanning();
                }}
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
