import React, { useRef } from "react";
import {
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    StyleProp,
    Pressable,
    Animated,
} from "react-native";

interface Props {
    title?: string;
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
}

export const Button = ({
    title,
    onPress,
    disabled,
    style,
    textStyle,
    children,
}: Props) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
                speed: 50,
                bounciness: 4,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0.85,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 50,
                bounciness: 4,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Animated.View
                style={[
                    styles.button,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                    style,
                ]}
            >
                {children ? (
                    children
                ) : (
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                )}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#7519EB",
        borderRadius: 85,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    text: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "500",
        // fontFamily: 'InstrumentSans-Normal',
    },
});
