import React from 'react';

import {
    StyleProp,
    Text,
    TextStyle,
    View,
} from 'react-native';
import { theme } from '../../global/styles/theme';
import { TextButton } from '../TextButton';

import { styles } from './styles';

type Props = {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    info: string;
    backButtonText?: string;
    onPress: () => void;
}

export function ConclusionScreen({ title, info, backButtonText, onPress }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
            <Text style={styles.info}>
                {info}
            </Text>
            <View style={styles.checkMarkContainer}>
                <View style={[styles.circle, { width: 175, height: 175, opacity: 0.65 }]} />
                <View style={styles.circle} />
                <Text style={{ fontSize: 64 }}>✅</Text>
            </View>
            <TextButton title={backButtonText ? backButtonText : "Voltar para a tela inicial"} buttonStyle={{ backgroundColor: theme.colors.secondary1, paddingHorizontal: 20, paddingVertical: 15 }} onPress={onPress} />
        </View>
    )
}