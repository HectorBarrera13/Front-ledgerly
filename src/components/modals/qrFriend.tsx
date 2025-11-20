import { View, Text, Button } from "react-native";
import { useEffect } from "react";
import { useQr } from "@hook/useQr";
import { Image } from "react-native";

interface AddFriendModalProps {
    visible: boolean;
    onClose: () => void;
    qrCodeUrl?: string;
}

export default function AddFriendModal({
    visible,
    onClose,
}: AddFriendModalProps) {
    const { qrCodeUrl, loading, error, loadQr } = useQr();

    useEffect(() => {
        if (visible) {
            loadQr();
        }
    }, [visible]);

    if (!visible) {
        return null;
    }

    return (
        <View>
            <View style={styles.modalContent}>
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    Tu código QR
                </Text>
                {loading && <Text>Cargando código QR...</Text>}
                {error && (
                    <Text style={{ color: "red" }}>
                        Error al generar el código QR: {error}
                        {qrCodeUrl}
                    </Text>
                )}
                {qrCodeUrl && (
                    <View style={{ alignItems: "center", marginBottom: 20 }}>
                        <Image
                            source={{ uri: qrCodeUrl }}
                            style={{ width: 200, height: 200 }}
                            resizeMode="contain"
                        />
                    </View>
                )}
                <Button title="Cerrar" onPress={onClose} />
            </View>
        </View>
    );
}

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
    },
};
