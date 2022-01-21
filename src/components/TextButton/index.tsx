import React from 'react';

import {
    Text,
    View,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';

import { styles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../../global/styles/theme';

type Props = TouchableOpacityProps & {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    colors?: Array<string>;
    icon?: any;
    buttonStyle?: any;
    textStyle?: any;
    shadow?: boolean;
}

export function TextButton({ title, colors, icon, buttonStyle, textStyle, shadow, ...rest }: Props) {
    icon ? buttonStyle = { ...buttonStyle, justifyContent: "space-around" } : buttonStyle = buttonStyle;
    const shadowOptions = theme.shadowProperties
    shadow ?
        buttonStyle = {
            ...buttonStyle,
            ...shadowOptions
        }
        : buttonStyle = buttonStyle;
    const Button =
        <TouchableOpacity
            // Verificamos se o botão possui gradiente, se possuir, inserimos o estilo de gradiente, caso não, inserimos o estilo padrão
            // Também verificamos se a propriedade de sombra foi inserida, para também adicionarmos o efeito ao botão
            style={colors ? (shadow ? [styles.button, shadowOptions] : styles.button) : [styles.gradient, buttonStyle]}
            /** Colocamos a propriedade "...rest" para passar ao botão todas as propriedades restantes que pertencem a ele */
            {...rest}
        >
            <View>
                {icon}
            </View>
            <Text style={textStyle ? [styles.title, textStyle] : styles.title}>
                {title}
            </Text>
        </TouchableOpacity>
    return ( // A propriedade "activeOpacity" influencia na opacidade do botão ao ser pressionado
        colors ?
            <LinearGradient
                colors={colors}
                style={buttonStyle ? [styles.gradient, buttonStyle] : styles.gradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            >
                {Button}
            </LinearGradient>
            : Button
    )
}