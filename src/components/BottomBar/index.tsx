import React from 'react';

import {
    Text,
    View,
} from 'react-native';

import { styles } from './styles';

type Props = {
    // A ? faz com que o elemento não seja obrigatório
    info?: string;
    element: any;
}

export function BottomBar({ info, element }: Props) {
    return (
        <View style={styles.container}>
            {
                info ? <Text style={styles.info}> {info} </Text> : null
            }
            {element}
        </View>
    )
}