import React from 'react';

import {
    Text,
    View,
} from 'react-native';

import { styles } from './styles';

type Props = {
    // A ? faz com que o elemento não seja obrigatório
    info?: string;
    element?: any;
    margin?: number;
}

export function BottomBar({ info, element, margin }: Props) {
    return (
        <View style={margin ? [styles.container, { marginBottom: margin }] : styles.container}>
            {
                info ? <Text style={styles.info}> {info} </Text> : null
            }
            {element}
        </View>
    )
}