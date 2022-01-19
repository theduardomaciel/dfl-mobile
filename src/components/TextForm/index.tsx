import React from 'react';

import {
    TextInput,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type Props = {
    title?: string;
    placeholder?: string;

    keyboardType?: string;
    autoCapitalize?: string;

    icon?: any;
    buttonIcon?: any;

    style?: any;
    titleStyle?: any;
    shadow?: boolean;
}

export function TextForm({ title, placeholder, keyboardType, autoCapitalize, icon, buttonIcon, style, titleStyle, shadow }: Props) {
    const shadowOptions = theme.shadowPropertiesLow;
    shadow ?
        style = {
            ...style,
            ...shadowOptions
        }
    : style = style;
    return (
        <View style={style.container}>
            {
                title ? <Text style={titleStyle ? [styles.title, titleStyle] : styles.title}>{title}</Text> : null
            }
            <View style={style ? [styles.inputContainer, style] : styles.inputContainer}>
                { icon }
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    autoCapitalize={'none'}
                    keyboardType={keyboardType ? keyboardType : 'default'}
                    allowFontScaling={false}
                    maxLength={45}
                />
                {buttonIcon ? <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.buttonIcon}
                >
                    { buttonIcon }
                </TouchableOpacity> : null }
            </View>
        </View>
    );
}