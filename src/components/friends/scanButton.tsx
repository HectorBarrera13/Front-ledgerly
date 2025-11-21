import {
    StyleSheet,
    TouchableOpacity,
    Text,
    StyleProp,
    ViewStyle,
} from "react-native";

interface ScanButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function ScanButton({
    title,
    onPress,
    disabled,
    style,
}: ScanButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style]}
            disabled={disabled}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "45%",
        height: 48,
        backgroundColor: "#661AE6",
        borderRadius: 85,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginVertical: 12,
    },
    text: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});
