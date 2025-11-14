import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';

interface Props {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const Button = ({ title, onPress, disabled, style, textStyle }: Props) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={disabled}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '85%',
        height: 48,
        backgroundColor: '#661AE6',
        borderRadius: 85,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 12,
    },
    text: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '500',
        // fontFamily: 'InstrumentSans-Normal', 
    }
});

