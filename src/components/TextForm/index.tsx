import React from 'react';

import {
    TextInput,
    Text,
    View,
    TextInputProps,
    ViewStyle,
    TextStyle,
    TouchableOpacity
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';
import { TextProps } from 'react-native';

type Props = TextInputProps & {
    title?: string;
    icon?: any;
    onIconPress?: () => void;

    customStyle?: ViewStyle;
    titleStyle?: TextStyle;

    textInputProps?: TextInputProps;
    fontStyle?: TextStyle;
    shadow?: boolean;
    disabled?: boolean;
}

export function TextForm({ title, icon, titleStyle, disabled = false, customStyle, textInputProps, fontStyle, onIconPress, shadow }: Props) {
    const shadowOptions = theme.shadowPropertiesLow;
    const decider = shadow ? [styles.inputContainer, shadowOptions, fontStyle] : [styles.inputContainer, fontStyle]
    // O problema estava na elevação (elevation), pois a da sombra era maior que a do ícone
    return (
        <View style={customStyle ? [styles.container, customStyle] : styles.container}>
            {
                title ? <Text style={titleStyle ? [styles.title, titleStyle] : styles.title}>{title}</Text> : null
            }
            <View style={[{ flex: 1 }, onIconPress ? { flexDirection: "row-reverse" } : null]}>
                <TextInput editable={!disabled} style={icon ? [decider, onIconPress ? { paddingRight: 30 } : { paddingLeft: 30 }] : decider}
                    {...textInputProps}
                />
                {
                    onIconPress ?
                        <TouchableOpacity disabled={disabled} style={styles.icon} onPress={onIconPress}>
                            {icon}
                        </TouchableOpacity>
                        :
                        <View style={[styles.icon, onIconPress ? { right: 25 } : { left: 5 }]}>
                            {icon}
                        </View>
                }
            </View>
        </View>
    );
}