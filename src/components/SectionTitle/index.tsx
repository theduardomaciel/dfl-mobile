import React from 'react';

import {
    StyleProp,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

import { styles } from './styles';

type Props = {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    info?: string;
    fontStyle?: StyleProp<TextStyle>;
    color?: string;
    hasLine?: boolean;
    viewStyle?: ViewStyle;
}

export function SectionTitle({ title, info, fontStyle, color, hasLine, viewStyle }: Props) {
    return (
        <View style={viewStyle ? [styles.container, viewStyle] : styles.container}>
            <View style={styles.textContainer}>
                <Text
                    style={
                        fontStyle ? [styles.title, fontStyle] : styles.title
                    }
                >
                    {title}
                </Text>
                {info ?
                    <Text style={styles.info}>
                        {info}
                    </Text>
                    : null
                }
            </View>
            {
                hasLine ?
                    <View style={
                        color ? [styles.line, { backgroundColor: color }] : styles.line
                    } />
                    : null
            }
        </View>
    )
}