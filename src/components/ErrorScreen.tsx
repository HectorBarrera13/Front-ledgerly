import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Button } from "./Button";

interface ErrorScreenProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    showRetryButton?: boolean;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
    title = "¡Oops! Algo salió mal",
    description = "No te preocupes, estas cosas pasan. Intenta nuevamente en un momento.",
    onRetry,
    showRetryButton = true,
}) => {
    return (
        <View style={styles.container}>
            <BlurView intensity={20} style={styles.blurContainer}>
                {/* Título */}
                <Text style={styles.title}>{title}</Text>

                {/* Descripción */}
                <Text style={styles.description}>{description}</Text>

                {/* Botón de reintentar */}
                {showRetryButton && onRetry && (
                    <Button
                        title="Reintentar"
                        onPress={onRetry}
                        style={styles.retryButton}
                    />
                )}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    blurContainer: {
        borderRadius: 20,
        padding: 50,
        alignItems: "center",
        width: "100%",
        maxWidth: 300,
        backgroundColor: "rgba(85, 10, 156, 0.29)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    iconContainer: {
        marginBottom: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgba(156, 10, 120, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    emoji: {
        fontSize: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: "#ffffffff",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 24,
    },
    retryButton: {
        width: "100%",
        marginTop: 8,
        backgroundColor: "#2e0ea35b",
    },
});

export default ErrorScreen;
