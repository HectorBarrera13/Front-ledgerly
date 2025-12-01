import React from "react";
import { TextInput, StyleSheet, View, Text, TextInputProps, StyleProp, ViewStyle } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && { borderColor: "#d32f2f" },
          style,
        ]}
        placeholderTextColor="#888"
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    width: "100%",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C1ED6",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: "#bdbdbd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    backgroundColor: "#f7f7f7",
    color: "#222",
  },
  error: {
    color: "#d32f2f",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;