import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import IconLedgerly from "@asset/icon/icon_ledgerly.svg";
import BinaryModal from "@/components/BinaryModal";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useQrFriendGenerator } from "@/hooks/useQrFriendGenerator";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function GenerateQRView() {
    const {
        generateQrCode,
        resetGeneratedQr,
        generatedQrError,
        generatedQr,
        generatingQr,
    } = useQrFriendGenerator();
    const [retryModalVisible, setRetryModalVisible] = useState(false);
    const [downloading, setDownloading] = useState(false);

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

    const downloadQrCode = async () => {
        if (!generatedQr) return;

        try {
            setDownloading(true);

            const fileName = `ledgerly_qr_${Date.now()}.png`;
            const file = new File(Paths.cache, fileName);

            const base64Data = generatedQr.replace(/^data:image\/png;base64,/, "");
            await file.write(base64Data, { encoding: "base64" });

            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(file.uri, {
                    mimeType: "image/png",
                    dialogTitle: "Guardar código QR",
                    UTI: "public.png"
                });
                
                Alert.alert(
                    "¡Listo!",
                    "Puedes guardar el código QR desde el menú de compartir."
                );
            } else {
                Alert.alert(
                    "Error",
                    "La función de compartir no está disponible en este dispositivo."
                );
            }
        } catch (error) {
            console.error("Error al descargar QR:", error);
            Alert.alert(
                "Error",
                "No se pudo compartir el código QR. Inténtalo de nuevo."
            );
        } finally {
            setDownloading(false);
        }
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
                {generatedQr && (
                    <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={downloadQrCode}
                        disabled={downloading}
                    >
                        <Text style={styles.downloadButtonText}>
                            {downloading ? "Descargando..." : "Descargar QR"}
                        </Text>
                    </TouchableOpacity>
                )}
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
        marginBottom: 15,
    },
    icon: {
        position: "absolute",
        bottom: 10,
    },
    downloadButton: {
        backgroundColor: "#7519EB",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 0,
        marginBottom: 25,
    },
    downloadButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
});
