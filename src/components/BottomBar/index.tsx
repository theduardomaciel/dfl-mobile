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
    height?: number;
    margin?: number;
}

export function BottomBar({ info, element, height, margin }: Props) {
    const newHeight = height ? [styles.container, { height: height }] : styles.container
    return (
        <View style={margin ? [newHeight, { marginBottom: margin }] : newHeight}>
            {
                info ? <Text style={styles.info}> {info} </Text> : null
            }
            {element}
        </View>
    )
}