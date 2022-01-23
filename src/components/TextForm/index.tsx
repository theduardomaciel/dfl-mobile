import React from 'react';

import {
    TextInput,
    Text,
    View,
    TextInputProps
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type Props = TextInputProps & {
    title?: string;
    icon?: any;

    style?: any;
    titleStyle?: any;

    textInputProps?: TextInputProps;
    shadow?: boolean;
}

export function TextForm({ title, icon, titleStyle, style, textInputProps, shadow }: Props) {
    const shadowOptions = theme.shadowPropertiesLow;
    // Estava dando erro pois, ao inserir o inputContainerStyle ao invés do styles.inputContainer, o ícone não aparecia
    /* let inputContainerStyle = styles.inputContainer;
    shadow ?
        inputContainerStyle = {
            ...inputContainerStyle,
            ...shadowOptions
        }
        : inputContainerStyle = styles.inputContainer; */
    const decider = shadow ? [styles.inputContainer, shadowOptions] : styles.inputContainer
    // O problema estava na elevação (elevation), pois a da sombra era maior que a do ícone
    return (
        <View style={style ? [styles.container, style] : styles.container}>
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

// style ? [styles.inputContainer, style] : styles.inputContainer