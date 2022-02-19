import React, { ReactNode, useState } from 'react';

import {
    View,
    Text
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import { theme } from '../../../global/styles/theme';
import { styles } from './styles';
import { defaultStyles } from '../defaultStyles';

type PickerTypes = {
    onSelectOption: (optionValue) => void;
}

export function DefaultCityPicker({ onSelectOption }: PickerTypes) {
    const [defaultCity, setDefaultCity] = useState();
    return (
        <View style={styles.container}>
            <Text style={defaultStyles.title}>
                Sua Cidade
            </Text>
            <View style={[defaultStyles.picker, theme.shadowPropertiesLow]}>
                <Picker
                    selectedValue={defaultCity}
                    onValueChange={(value) => {
                        setDefaultCity(value)
                        onSelectOption(value)
                    }}
                    style={{ width: 155, fontSize: 12, color: theme.colors.secondary1, alignSelf: "center", marginLeft: 5 }}
                    dropdownIconColor={theme.colors.secondary1}
                    mode='dropdown'
                >
                    <Picker.Item label="Maceió" value="Maceió, AL - Brasil" />
                    <Picker.Item label="Recife" value="Recife, PE - Brasil" />
                    <Picker.Item label="Arapiraca" value="Arapiraca, AL - Brasil" />
                    <Picker.Item label="Aracaju" value="Aracaju, SE - Brasil" />
                    <Picker.Item label="Teresina" value="Teresina, CE - Brasil" />
                    <Picker.Item label="São Paulo" value="São Paulo, SP - Brasil" />
                    <Picker.Item label="Rio Largo" value="Rio Largo, AL - Brasil" />
                    <Picker.Item label="Salvador" value="Salvador, BA - Brasil" />
                </Picker>
            </View>
        </View>
    );
}