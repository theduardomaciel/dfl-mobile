import React from 'react';

import {
    StyleProp,
    Text,
    TextStyle,
    View,
} from 'react-native';

import { styles } from './styles';

type Props = {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    info?: string;
    fontStyle?: StyleProp<TextStyle>;
    color?: string;
}

export function SectionTitle({ title, info, fontStyle, color }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text
                    style={
                        fontStyle ? fontStyle : styles.title
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
            <View
                style={
                    color ? [styles.line, { backgroundColor: color }] : styles.line
                }
            />
        </View>
    )
}