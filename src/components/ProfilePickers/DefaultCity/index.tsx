import React, { ReactNode } from 'react';

import {
    View,
    Text
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import { theme } from '../../../global/styles/theme';
import { styles } from './styles';
import { defaultStyles } from '../defaultStyles';

export function DefaultCityPicker() {
    return (
        <View style={styles.container}>
            <Text style={defaultStyles.title}>
                Sua Cidade
            </Text>
            <View style={[defaultStyles.picker, theme.shadowPropertiesLow]}>
                <Picker
                    style={{ width: 150, fontSize: 12, color: theme.colors.secondary1, alignSelf: "center", marginLeft: 5 }}
                    dropdownIconColor={theme.colors.secondary1}
                    mode='dropdown'
                >
                    <Picker.Item label="Maceió" value="Maceió" />
                    <Picker.Item label="Recife" value="js" />
                    <Picker.Item label="Arapiraca" value="Maceió" />
                    <Picker.Item label="Aracaju" value="js" />
                    <Picker.Item label="Teresina" value="Maceió" />
                    <Picker.Item label="São Paulo" value="js" />
                    <Picker.Item label="Rio Largo" value="Maceió" />
                    <Picker.Item label="Salvador" value="js" />
                </Picker>
            </View>
        </View>
    );
}