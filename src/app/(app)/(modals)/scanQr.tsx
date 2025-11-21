// scanQr.tsx
import { StyleSheet, Text, View } from "react-native";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";
import CameraQr from "@/components/cameraQr";

export default function ScanQrView() {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View style={styles.qrCamera}>
                    <CameraQr />
                </View>
                <Text style={styles.instruction}>
                    ¡Escanea el QR de tus amigos para añadirlos!
                </Text>
                <IconLedgerly style={styles.icon} />
            </View>
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
