import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ImageBackground } from "react-native";
import { Button } from "@component/Button";
import { AuthInput } from "@component/AuthInput";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { isValidEmail, isNotEmpty, isValidPassword } from "@/libs/validation";
import EmailIcon from "@asset/icon/icon_mail.svg";
import PasswordIcon from "@asset/icon/icon_password.svg";
import { authService } from "@service/authService";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!isNotEmpty(email) || !isNotEmpty(password)) {
            Alert.alert("Campos vacíos");
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert(
                "Correo inválido",
                "Por favor ingresa un correo válido."
            );
            return;
        }
        if (!isValidPassword(password)) {
            Alert.alert(
                "Contraseña inválida",
                "La contraseña debe tener al menos 8 caracteres."
            );
            return;
        }
        try {
            setLoading(true);
            setError(null);

            await authService.signIn(email, password);
        } catch (error: any) {
            setError(
                error instanceof Error ? error.message : "An error occurred"
            );
            Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Ocurrió un error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require("@asset/img/bg_screen.jpg")}
            style={styles.background}
            resizeMode="cover"

        >
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.welcome}>Bienvenid@ a</Text>
                <Text style={styles.title}>
                    Ledger
                    <Text style={styles.titleAccent}>ly</Text>!
                </Text>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.loginTitle}>Iniciar sesión</Text>
                <AuthInput
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    Icon={EmailIcon}
                    iconPosition="left"
                    containerStyle={[{ marginBottom: 35 }, styles.inputCentered]}
                />
                <AuthInput
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    Icon={PasswordIcon}
                    iconPosition="left"
                    iconLeftStyle={{ left: 11 }}
                    iconSize={30}
                    containerStyle={styles.inputCentered}
                />
                <View style={styles.forgotContainer}>
                    <Text style={styles.forgotText}>
                        ¿Olvidaste tu contraseña?
                    </Text>
                    <Text style={styles.forgotLink} onPress={() => {}}>
                        ¡Haz click aquí!
                    </Text>
                </View>
                <Button
                    title={loading ? "Cargando..." : "Iniciar sesión"}
                    onPress={handleLogin}
                    disabled={loading}
                    style={styles.loginButton}
                    textStyle={styles.loginButtonText}
                />
                <View style={styles.divider} />
                <Text style={styles.noAccount}>
                    <Text style={{ fontWeight: "bold" }}>
                        ¿No tienes una cuenta?
                    </Text>
                </Text>
                <Button
                    title="Regístrate"
                    onPress={() => router.push("signup")}
                    style={styles.registerButton}
                    textStyle={styles.registerButtonText}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    header: {
        marginTop: 100,
        alignItems: "center",
    },
    welcome: {
        color: "#fff",
        fontSize: 20,
        marginBottom: 5,
        fontWeight: "400",
        fontFamily: "Inter-Regular",
    },
    title: {
        color: "#fff",
        fontSize: 48,
        fontWeight: "bold",
        letterSpacing: 1.5,
        fontFamily: "InstumentSans-Bold",
    },
    titleAccent: {
        color: "#C9A2FF",
    },
    formContainer: {
        backgroundColor: "#fff",
        marginTop: 70,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 30,
        flex: 1,
        alignItems: "stretch",
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#444",
        marginBottom: 24,
        alignSelf: "center",
        fontFamily: "InstumentSans-Bold",
    },
    forgotContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
        marginBottom: 38,
        marginLeft: 15,
        marginTop: 10,
    },
    forgotText: {
        color: "#888",
        fontSize: 14,
        fontFamily: "Inter-Regular",
    },
    forgotLink: {
        color: "#296BFF",
        fontSize: 14,
        marginLeft: 4,
        textDecorationLine: "underline",
    },
    loginButton: {
        backgroundColor: "#7B1FFF",
        borderRadius: 30,
        width: "100%",
        marginBottom: 15,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "InstumentSans-Bold",
    },
    
    inputCentered: {
        alignSelf: "center",
        width: "100%", 
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        width: "100%",
        marginVertical: 18,
    },
    noAccount: {
        color: "#444",
        fontSize: 16,
        marginBottom: 12,
        alignSelf: "center",
        fontFamily: "InstumentSans-Bold",
    },
    registerButton: {
        borderColor: "#7B1FFF",
        borderWidth: 2,
        borderRadius: 30,
        width: "100%",
        backgroundColor: "#fff",
    },
    registerButtonText: {
        color: "#7B1FFF",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "InstumentSans-Bold",
    },
});
