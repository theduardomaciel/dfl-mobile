import React from 'react';

import {
    Text,
    View,
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type Props = {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    info?: string;
}

export function SectionTitle({ title, info }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    {title}
                </Text>
                { info ? 
                    <Text style={styles.info}>
                        {info}
                    </Text> 
                    : null 
                }
            </View>
            <View style={styles.line} />
        </View>
    )
}