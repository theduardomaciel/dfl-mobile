import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    ViewProps,
    ViewStyle
} from 'react-native';

import { styles } from './styles';

type Props = ViewProps & {
    // A ? faz com que o elemento não seja obrigatório
    info?: string;
    element?: React.ReactNode;
    viewStyle?: ViewStyle;
}

export function BottomBar({ info, element, viewStyle, ...rest }: Props) {
    return (
        <View style={viewStyle ? [viewStyle, styles.container] : styles.container} {...rest}>
            {
                info ? <Text style={styles.info}>{info}</Text> : null
            }
            {element}
        </View>
    )
}