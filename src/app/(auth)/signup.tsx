import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Linking,
} from "react-native";
import { Button } from "@component/Button";
import { AuthInput } from "@component/AuthInput";
import { authService } from "@service/authService";

export default function SignupScreen() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [acceptPolicy, setAcceptPolicy] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        if (!acceptPolicy) {
            Alert.alert(
                "Debes aceptar las políticas de privacidad para continuar."
            );
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await authService.signUp({
                email,
                password,
                firstName,
                lastName,
                phone: {
                    countryCode,
                    number: phoneNumber,
                },
            });
        } catch (error: any) {
            setError(error.message || "Ocurrió un error");
            Alert.alert(
                error instanceof Error ? error.message : "Ocurrió un error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

            <AuthInput
                placeholder="Nombre"
                value={firstName}
                onChangeText={setFirstName}
                containerStyle={styles.input}
            />
            <AuthInput
                placeholder="Apellido"
                value={lastName}
                onChangeText={setLastName}
                containerStyle={styles.input}
            />
            <AuthInput
                placeholder="Código de país"
                value={countryCode}
                onChangeText={setCountryCode}
                containerStyle={styles.input}
            />
            <AuthInput
                placeholder="Teléfono"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                containerStyle={styles.input}
            />
            <AuthInput
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                containerStyle={styles.input}
            />
            <AuthInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                containerStyle={styles.input}
            />

            {/* Checkbox de políticas */}
            <View style={styles.policyRow}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setAcceptPolicy(!acceptPolicy)}
                >
                    {acceptPolicy ? (
                        <View style={styles.checkedBox} />
                    ) : (
                        <View style={styles.uncheckedBox} />
                    )}
                </TouchableOpacity>
                <Text style={styles.policyText}>
                    Acepto las{" "}
                    <Text
                        style={styles.policyLink}
                        onPress={() =>
                            Linking.openURL("https://www.tu-url.com/politicas")
                        }
                    >
                        políticas de privacidad
                    </Text>
                </Text>
            </View>

            <Button
                title="Crear Cuenta"
                onPress={handleRegister}
                disabled={loading || !acceptPolicy}
                style={[
                    styles.registerButton,
                    !acceptPolicy && { opacity: 0.8 },
                ]}
                textStyle={styles.registerButtonText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 32,
        justifyContent: "flex-start",
    },
    backButton: {
        position: "absolute",
        left: 16,
        top: 32,
        zIndex: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 2,
    },
    backButtonText: {
        fontSize: 28,
        color: "#6C38FF",
        fontWeight: "bold",
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#6C38FF",
        alignSelf: "center",
        marginBottom: 24,
        marginTop: 16,
    },
    input: {
        marginBottom: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#CFCFCF",
        backgroundColor: "#fff",
        paddingLeft: 8,
        paddingRight: 8,
    },
    policyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        marginTop: 4,
        marginLeft: 2,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: "#CFCFCF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        backgroundColor: "#fff",
    },
    checkedBox: {
        width: 14,
        height: 14,
        borderRadius: 3,
        backgroundColor: "#6C38FF",
    },
    uncheckedBox: {
        width: 14,
        height: 14,
        borderRadius: 3,
        backgroundColor: "#fff",
    },
    policyText: {
        fontSize: 14,
        color: "#222",
    },
    policyLink: {
        color: "#3777F0",
        textDecorationLine: "underline",
    },
    registerButton: {
        backgroundColor: "#6C38FF",
        borderRadius: 30,
        marginTop: 8,
        marginBottom: 12,
        height: 54,
        justifyContent: "center",
        alignItems: "center",
    },
    registerButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
});
