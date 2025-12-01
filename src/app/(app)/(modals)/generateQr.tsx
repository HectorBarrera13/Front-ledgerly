import { Text, View, StyleSheet, Image } from "react-native";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";
import BinaryModal from "@/components/BinaryModal";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useQrFriendGenerator } from "@/hooks/useQrFriendGenerator";
export default function GenerateQRView() {
    const {
        generateQrCode,
        resetGeneratedQr,
        generatedQrError,
        generatedQr,
        generatingQr,
    } = useQrFriendGenerator();
    const [retryModalVisible, setRetryModalVisible] = useState(false);

    useEffect(() => {
        generateQrCode();
    }, []);

    useEffect(() => {
        if (generatedQrError) {
            setRetryModalVisible(true);
        }
    }, [generatedQrError]);

    const onRetry = async () => {
        setRetryModalVisible(false);
        resetGeneratedQr();
        await generateQrCode();
    };

    const onCancel = () => {
        setRetryModalVisible(false);
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View style={styles.qrContainer}>
                    {generatingQr ? (
                        <Text>Cargando código QR...</Text>
                    ) : generatedQr ? (
                        <Image
                            source={{ uri: generatedQr }}
                            style={{ width: 350, height: 350 }}
                        />
                    ) : null}
                </View>
                <Text style={styles.instruction}>
                    ¡Muestra este código QR a tus amigos para que puedan
                    agregarte fácilmente!
                </Text>
                <IconLedgerly style={styles.icon} />
            </View>
            <BinaryModal
                visible={retryModalVisible}
                title={
                    generatedQrError
                        ? generatedQrError.title
                        : "Error desconocido"
                }
                description={
                    generatedQrError
                        ? generatedQrError.description
                        : "Ha ocurrido un error desconocido."
                }
                buttonTextFirst="Cancelar"
                buttonTextSecond="Reintentar"
                onPressFirst={onCancel}
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
        height: 500,
    },
    qrContainer: {
        width: 300,
        height: 300,
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
        bottom: 30,
    },
});
