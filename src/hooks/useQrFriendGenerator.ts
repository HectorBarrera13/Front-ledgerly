import { useState } from "react";
import friendService from "@service/friendService";
import { PresentableError } from "@/types/Errors";

export function useQrFriendGenerator() {
    const [generatedQr, setGeneratedQr] = useState<string | null>(null);
    const [generatedQrError, setGeneratedQrError] =
        useState<PresentableError | null>(null);
    const [generatingQr, setGeneratingQr] = useState(false);

    const generateQrCode = async () => {
        try {
            setGeneratingQr(true);
            setGeneratedQrError(null);
            const qrCodeUri = await friendService.loadQr();
            setGeneratedQr(qrCodeUri);
        } catch (error) {
            const presentableError =
                error instanceof PresentableError
                    ? error
                    : new PresentableError(
                          "Error inesperado",
                          "Ocurrió un error inesperado al generar el QR."
                      );
            setGeneratedQrError(presentableError);
        } finally {
            setGeneratingQr(false);
        }
    };

    const resetGeneratedQr = () => {
        setGeneratedQr(null);
        setGeneratedQrError(null);
    };

    return {
        // Generate states
        generatedQr,
        generatedQrError,
        generatingQr,

        // Generate actions
        generateQrCode,
        resetGeneratedQr,
    };
}
