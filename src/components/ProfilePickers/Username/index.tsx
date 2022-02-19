import React, { ReactNode } from 'react';

import {
    View,
    Text
} from 'react-native';

import { theme } from '../../../global/styles/theme';
import { styles } from './styles';
import { defaultStyles } from '../defaultStyles';

import { TextForm } from '../../TextForm';
import { TextInput } from 'react-native-gesture-handler';

export function UsernamePicker() {
    return (
        <View style={styles.container}>
            <Text style={defaultStyles.title}>
                Nome de Usuário
            </Text>
            <TextInput placeholder='nomedeusuário' textAlign='center' autoCapitalize={"none"} style={[defaultStyles.picker, { width: 250 }, theme.shadowPropertiesLow]} />
        </View>
    );
}