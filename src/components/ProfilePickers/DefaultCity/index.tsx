import React, { ReactNode, useState } from 'react';

import {
    View,
    Text
} from 'react-native';

import { Picker as SelectPicker } from '@react-native-picker/picker';

import { theme } from '../../../global/styles/theme';
import { styles } from './styles';
import { defaultStyles } from '../defaultStyles';

type PickerTypes = {
    state: any;
    setState: any;
}

export function DefaultCityPicker({ state, setState }: PickerTypes) {
    return (
        <View style={styles.container}>
            <Text style={defaultStyles.title}>
                Sua Cidade
            </Text>
            <View style={[defaultStyles.picker, theme.shadowPropertiesLow]}>
                <SelectPicker
                    selectedValue={state}
                    onValueChange={(value) => {
                        setState(value)
                    }}
                    style={{ width: 155, fontSize: 12, color: theme.colors.secondary1, alignSelf: "center", marginLeft: 5 }}
                    dropdownIconColor={theme.colors.secondary1}
                    mode='dropdown'
                >
                    <SelectPicker.Item label="Maceió" value="Maceió, AL - Brasil" />
                    <SelectPicker.Item label="Rio Largo [beta]" value="Rio Largo, AL - Brasil" />
                    <SelectPicker.Item label="Satuba [beta]" value="Satuba, AL - Brasil" />
                </SelectPicker>
            </View>
        </View>
    );
}