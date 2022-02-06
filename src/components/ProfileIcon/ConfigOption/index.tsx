import React from 'react';

import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { styles } from './styles';

type Props = TouchableOpacityProps & {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    description: string;
    icon: any;
    id: string;
}

export function ConfigOption({ title, id, description, icon, ...rest }: Props) {
    return (
        <TouchableOpacity activeOpacity={0.7} style={id === "0" ? [styles.container, { marginTop: 35 }] : styles.container} {...rest}>
            {icon}
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </TouchableOpacity>
    )
}