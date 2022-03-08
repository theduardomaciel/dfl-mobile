import React from 'react';

import {
    Text,
    View,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';

import { styles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../../global/styles/theme';

type Props = TouchableOpacityProps & {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    colors?: Array<string>;
    icon?: any;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    iconStyle?: ViewStyle;
    shadow?: boolean;
    shadowType?: ViewStyle;
    isLoading?: boolean;
}

export function TextButton({ title, colors, icon, iconStyle, buttonStyle, textStyle, shadow, shadowType, isLoading, ...rest }: Props) {
    icon ? buttonStyle = { ...buttonStyle, justifyContent: "space-around" } : buttonStyle = buttonStyle;
    const shadowOptions = shadowType ? shadowType : theme.shadowProperties
    const hasShadow = shadow || shadowType
    shadow ?
        buttonStyle = {
            ...buttonStyle,
            ...shadowOptions
        }
        : buttonStyle = buttonStyle;
    const Button =
        <TouchableOpacity
            disabled={isLoading ? true : false}
            activeOpacity={0.8}
            // Verificamos se o botão possui gradiente, se possuir, inserimos o estilo de gradiente, caso não, inserimos o estilo padrão
            // Também verificamos se a propriedade de sombra foi inserida, para também adicionarmos o efeito ao botão
            style={colors ? (hasShadow ? [styles.button, shadowOptions] : styles.button) : [styles.gradient, buttonStyle, hasShadow ? shadowOptions : null]}
            /** Colocamos a propriedade "...rest" para passar ao botão todas as propriedades restantes que pertencem a ele */
            {...rest}
        >
            {
                isLoading ?
                    <ActivityIndicator size={"small"} color={textStyle.color ? textStyle.color : styles.title.color} animating={isLoading} />
                    :
                    <>
                        <View style={iconStyle}>
                            {icon}
                        </View>
                        <Text style={textStyle ? [styles.title, textStyle] : styles.title}>
                            {title}
                        </Text>
                    </>
            }

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