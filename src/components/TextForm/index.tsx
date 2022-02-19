import React from 'react';

import {
    TextInput,
    Text,
    View,
    TextInputProps,
    ViewStyle,
    TextStyle
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type Props = TextInputProps & {
    title?: string;
    icon?: any;

    customStyle?: ViewStyle;
    titleStyle?: TextStyle;

    textInputProps?: TextInputProps;
    shadow?: boolean;
}

export function TextForm({ title, icon, titleStyle, customStyle, textInputProps, shadow }: Props) {
    const shadowOptions = theme.shadowPropertiesLow;
    const decider = shadow ? [styles.inputContainer, shadowOptions] : styles.inputContainer
    // O problema estava na elevação (elevation), pois a da sombra era maior que a do ícone
    return (
        <View style={customStyle ? [styles.container, customStyle] : styles.container}>
            {
                title ? <Text style={titleStyle ? [styles.title, titleStyle] : styles.title}>{title}</Text> : null
            }
            <View style={{ flex: 1 }}>
                <TextInput style={icon ? [decider, { paddingLeft: 30 }] : decider}
                    {...textInputProps}
                />
                <View style={styles.icon}>
                    {icon}
                </View>
            </View>
        </View>
    );
}