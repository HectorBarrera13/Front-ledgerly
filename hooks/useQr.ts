import { useState } from "react";

import friendService from "@/services/friendService";

export function useQr() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadQr = async () => {
        try {
            setLoading(true);
            setError(null);
            const qrUrl = await friendService.loadQr();
            if (!qrUrl) {
                throw new Error("QR code URL is empty");
            }
            setQrCodeUrl(qrUrl);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load QR code"
            );
        } finally {
            setLoading(false);
        }
    };

    return { qrCodeUrl, loading, error, loadQr };
}
