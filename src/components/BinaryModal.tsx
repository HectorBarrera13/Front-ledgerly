import {
    View,
    Text,
    Modal,
    Pressable,
    StyleProp,
    ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "./Button";

interface BinaryModalProps {
    onPressFirst: () => void;
    onPressSecond: () => void;
    buttonTextFirst: string;
    buttonTextSecond: string;
    firstButtonStyle?: StyleProp<ViewStyle>;
    secondButtonStyle?: StyleProp<ViewStyle>;
    visible: boolean;
    animationType?: "slide" | "fade" | "none";
    transparent?: boolean;
    description: string;
    title: string;
}

export default function BinaryModal(props: BinaryModalProps) {
    return (
        <Modal
            animationType={props.animationType || "fade"}
            transparent={props.transparent || true}
            visible={props.visible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.description}>{props.description}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 35,
                            position: "absolute",
                            bottom: 25,
                        }}
                    >
                        <Button
                            style={
                                props.firstButtonStyle || {
                                    ...styles.button,
                                    backgroundColor: "#f8653cff",
                                    width: "100%",
                                }
                            }
                            onPress={props.onPressFirst}
                        >
                            <Text style={styles.buttonText}>
                                {props.buttonTextFirst}
                            </Text>
                        </Button>
                        <Button
                            style={
                                props.secondButtonStyle || {
                                    ...styles.button,
                                    backgroundColor: "#0ac78eff",
                                    width: "100%",
                                }
                            }
                            onPress={props.onPressSecond}
                        >
                            <Text style={styles.buttonText}>
                                {props.buttonTextSecond}
                            </Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 24,
        padding: 40,
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        width: "85%",
        height: "40%",
        maxWidth: 400,
        justifyContent: "center",
    },
    title: {
        position: "absolute",
        top: 60,
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 10,
        color: "#1a1a1a",
        textAlign: "center",
    },
    description: {
        fontSize: 15,
        textAlign: "center",
        marginBottom: 28,
        color: "#666",
        lineHeight: 24,
        paddingHorizontal: 8,
    },
    button: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        marginBottom: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        width: 120,
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.5,
    },
});
