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

const TEXT_DISTANCE_FROM_ICON = 35
const ICON_DISTANCE_FROM_BORDER = 15

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
                <TextInput editable={!disabled} style={icon ? [decider, onIconPress ? { paddingRight: TEXT_DISTANCE_FROM_ICON } : { paddingLeft: TEXT_DISTANCE_FROM_ICON }] : decider}
                    {...textInputProps}
                />
                {
                    onIconPress ?
                        <TouchableOpacity disabled={disabled} style={[styles.icon, { left: ICON_DISTANCE_FROM_BORDER }]} onPress={onIconPress}>
                            {icon}
                        </TouchableOpacity>
                        :
                        <View style={[styles.icon, { left: ICON_DISTANCE_FROM_BORDER / 1.5 }]}>
                            {icon}
                        </View>
                }
            </View>
        </View>
    );
}