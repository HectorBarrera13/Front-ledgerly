import {
    StyleSheet,
    TouchableOpacity,
    Text,
    StyleProp,
    ViewStyle,
} from "react-native";
import { Button } from "@component/Button";

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
        <Button
            onPress={onPress}
            style={[styles.button, style]}
            disabled={disabled}
        >
            <Text style={styles.text}>{title}</Text>
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
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
