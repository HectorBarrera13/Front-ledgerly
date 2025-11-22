import { useState } from "react";

import friendService from "@service/friendService";
import { BarcodeScanningResult } from "expo-camera";
import { PresentableError } from "@/types/Errors";

export function useQrFriend() {
    const [scanning, setScanning] = useState<boolean>(false);
    const [qrResult, setQrResult] = useState<string | null>(null);
    const [error, setError] = useState<PresentableError | null>(null);

    const startScanning = (result: BarcodeScanningResult) => {
        // Evitar procesar si ya estamos escaneando
        if (scanning || qrResult) return;

        if (result && result.data) {
            setScanning(true);
            setQrResult(result.data);
            setError(null);
        }
    };

    const resetScanning = () => {
        setScanning(false);
        setQrResult(null);
        setError(null);
    };

    const addFriendFromQr = async () => {
        if (!qrResult) return;
        console.log("Añadiendo amigo desde QR:", qrResult);
        try {
            await friendService.add(qrResult);
            setQrResult(null);
            setScanning(false);
        } catch (error) {
            if (error instanceof PresentableError) {
                setError(error);
            } else {
                setError(
                    new PresentableError(
                        "Error inesperado",
                        "Ocurrió un error inesperado al añadir al amigo."
                    )
                );
            }
        }
    };

    return {
        scanning,
        qrResult,
        error,
        startScanning,
        addFriendFromQr,
        resetScanning,
    };
}
