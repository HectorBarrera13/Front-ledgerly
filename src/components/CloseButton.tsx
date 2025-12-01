import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { useRouter } from "expo-router";


interface CloseButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  size?: number; // tamaño opcional
}

export default function CloseButton({ onPress, style, size = 18 }: CloseButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      style={[styles.button, style]}
    >
      <Text style={[styles.text, { fontSize: size }]}>✕</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    backgroundColor: "#eee",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#333",
    fontWeight: "bold",
  },
});
