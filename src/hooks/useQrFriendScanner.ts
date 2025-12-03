import { useState } from "react";
import friendService from "@service/friendService";
import { BarcodeScanningResult } from "expo-camera";
import { PresentableError } from "@/types/Errors";

export function useQrFriendScanner() {
    const [scanning, setScanning] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [scanError, setScanError] = useState<PresentableError | null>(null);

    const startScanning = async (result: BarcodeScanningResult) => {
        if (scanning || scanned) return; 
        setScanned(false);
        setScanning(true);
        if (result?.data) {
            await addFriendFromQr(result.data);
        }
        setScanning(false);
    };

    const resetScanning = () => {
        setScanError(null);
        setScanning(false);
        setScanned(false);
    };

    const addFriendFromQr = async (qrData: string) => {
        if (scanned) return;
        try {
            await friendService.add(qrData);
            setScanned(true);
        } catch (error) {
            const presentableError =
                error instanceof PresentableError
                    ? error
                    : new PresentableError(
                          "Error inesperado",
                          "Ocurrió un error inesperado al añadir al amigo."
                      );
            setScanError(presentableError);
        } finally {
            setScanning(false);
        }
    };

    return {
        scanError,
        scanned,

        // Scan actions
        startScanning,
        resetScanning,
    };
}
