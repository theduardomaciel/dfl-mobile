import React from 'react';

import {
    View,
    ViewStyle
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type Props = {
    CustomText: any;
    customStyle?: ViewStyle
}

export function HintView({ CustomText, customStyle }: Props) {
    return (
        <View style={customStyle ? [styles.container, customStyle] : styles.container}>
            <CustomText />
        </View>
    );
}

export const HintViewTextStyle = styles.text