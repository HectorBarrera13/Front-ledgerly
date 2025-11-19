import React from "react";
import { TextInput, StyleSheet, View, TextInputProps, StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

interface Props extends TextInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    Icon?: React.FC<SvgProps>;
    iconPosition?: "left" | "right";
    containerStyle?: StyleProp<ViewStyle>;
    iconLeftStyle?: StyleProp<ViewStyle>;
    iconSize?: number;
}

export const AuthInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    Icon,
    iconPosition = "left",
    containerStyle,
    iconLeftStyle,
    iconSize = 22,
    style,
    ...rest
}: Props) => {
    return (
        <View style={[styles.inputContainer, containerStyle]}>
            {Icon && iconPosition === "left" && (
                <View style={[styles.iconLeft, iconLeftStyle,]}>
                    <Icon width={iconSize} height={iconSize} />
                </View>
            )}
            <TextInput
                style={[
                    styles.input,
                    Icon && iconPosition === "left" && { paddingLeft: 40 },
                    Icon && iconPosition === "right" && { paddingRight: 40 },
                    style,
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                {...rest}
            />
            {Icon && iconPosition === "right" && (
                <View style={styles.iconRight}>
                    <Icon width={22} height={22} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "92%",
        backgroundColor: "#f7f7f7",
        borderRadius: 65,
        borderWidth: 2,
        borderColor: "#bdbdbd",
        paddingHorizontal: 10,
        height: 50,
    },
    input: {
        flex: 1,
        height: "100%",
        fontSize: 18,
        color: "#888",
        backgroundColor: "transparent",
        borderWidth: 0,
    },
    iconLeft: {
        position: "absolute",
        left: 15,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    iconRight: {
        position: "absolute",
        right: 18,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
});
