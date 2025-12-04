import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePicture } from "@/services/profileService";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import CloseButton from "@/components/CloseButton";

export default function AddProfilePicture() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("picture", {
            uri: image,
            name: "profile.jpg",
            type: "image/jpeg",
        } as any);

        try {
            await uploadProfilePicture(formData);
            Alert.alert("Foto subida", "Tu foto de perfil se ha actualizado.");
            router.back();
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "No se pudo subir la imagen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Cambiar foto de perfil</Text>
                <CloseButton style={styles.closeButton} onPress={() => router.back()} />
            </View>
            <View style={styles.content}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                        <View style={styles.avatarWrapper}>
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.placeholderAvatar}>
                                    <Text style={styles.placeholderText}>+</Text>
                                </View>
                            )}
                            <View style={styles.editIcon}>
                                <Text style={styles.editIconText}>📷</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarHint}>
                        {image ? "¡Imagen lista para subir!" : "Selecciona una imagen"}
                    </Text>
                </View>
                <Button
                    title={loading ? "Subiendo..." : "Subir imagen"}
                    onPress={uploadImage}
                    disabled={!image || loading}
                    style={styles.uploadBtn}
                />
                {loading && <ActivityIndicator style={{ marginTop: 20 }} color="#7519EB" />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 24,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
        marginTop: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#7519EB",
    },
    closeButton: {
        marginLeft: 8,
    },
    content: {
        flex: 1,
        justifyContent: "center",
    },
    avatarSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    avatarWrapper: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        position: "relative",
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    placeholderAvatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#E0E0E0",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        fontSize: 60,
        color: "#B5B5B5",
        fontWeight: "bold",
    },
    editIcon: {
        position: "absolute",
        right: 10,
        bottom: 10,
        backgroundColor: "#7519EB",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
        elevation: 4,
    },
    editIconText: {
        color: "#fff",
        fontSize: 22,
    },
    avatarHint: {
        marginTop: 18,
        fontSize: 15,
        color: "#888",
        textAlign: "center",
    },
    uploadBtn: {
        marginTop: 12,
        width: "100%",
        borderRadius: 32,
        backgroundColor: "#7519EB",
        paddingVertical: 16,
    },
});