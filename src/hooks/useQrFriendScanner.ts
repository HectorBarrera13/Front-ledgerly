import { useState } from "react";
import friendService from "@service/friendService";
import { BarcodeScanningResult } from "expo-camera";
import { PresentableError } from "@/types/Errors";

export function useQrFriendScanner() {
    const [qrResult, setQrResult] = useState<string | null>(null);
    const [scanError, setScanError] = useState<PresentableError | null>(null);
    const [addingFriend, setAddingFriend] = useState(false);

    const startScanning = (result: BarcodeScanningResult) => {
        if (qrResult) return;

        if (result?.data) {
            setQrResult(result.data);
            setScanError(null);
        }
    };

    const resetScanning = () => {
        setQrResult(null);
        setScanError(null);
        setAddingFriend(false);
    };

    const addFriendFromQr = async () => {
        if (!qrResult) return;

        try {
            setAddingFriend(true);
            setScanError(null);
            console.log("QR Result:", qrResult);
            await friendService.add(qrResult);
            setQrResult(null);
        } catch (error) {
            console.error("Error adding friend from QR:", error);
            const presentableError =
                error instanceof PresentableError
                    ? error
                    : new PresentableError(
                          "Error inesperado",
                          "Ocurrió un error inesperado al añadir al amigo."
                      );
            setScanError(presentableError);
        } finally {
            setAddingFriend(false);
        }
    };

    return {
        // Scan states
        qrResult,
        scanError,
        addingFriend,
        scanning: !!qrResult, // Computed value

        // Scan actions
        startScanning,
        addFriendFromQr,
        resetScanning,
    };
}
