import React from 'react';

import {
    View,
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type Props = {
    CustomText: () => Element;
}

export function HintView({ CustomText }: any) {
    return (
        <View style={styles.container}>
            <CustomText />
        </View>
    );
}

export const HintViewTextStyle = styles.text