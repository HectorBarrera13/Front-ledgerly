import { useEffect, useState } from "react";
import { getProfilePicture } from "@/services/profileService";

export default function useProfilePicture() {
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const reloadProfilePicture = async () => {
        setLoading(true);
        try {
            const { url } = await getProfilePicture();
            setProfilePicUrl(url || null);
        } catch {
            setProfilePicUrl(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reloadProfilePicture();
    }, []);

    return { profilePicUrl, loading, reloadProfilePicture };
}