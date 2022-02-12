import React from 'react';

import {
    View,
    ViewProps
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type Props = {
    CustomText: () => Element;
    customStyle: ViewProps;
}

export function HintView({ CustomText, customStyle }: any) {
    return (
        <View style={customStyle ? [styles.container, customStyle] : styles.container}>
            <CustomText />
        </View>
    );
}

export const HintViewTextStyle = styles.text