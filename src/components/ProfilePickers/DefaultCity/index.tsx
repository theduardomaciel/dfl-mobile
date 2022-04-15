import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker'

import { Text, View } from 'react-native';

import { styles } from './styles';
import { theme } from '../../../global/styles/theme';
import { defaultStyles } from '../defaultStyles';

type CustomProps = {
    changedScope: (scope, newRegion) => void;
}

export function DefaultCityPicker({ changedScope }: CustomProps) {
    const [selectedScope, setSelectedScope] = useState();
    return (
        <View style={styles.container}>
            <Text style={defaultStyles.title}>
                Sua Cidade
            </Text>
            <View style={[defaultStyles.picker, theme.shadowPropertiesLow]}>
                <Picker
                    style={styles.picker}
                    mode={"dropdown"}
                    dropdownIconColor={theme.colors.secondary1}
                    selectedValue={selectedScope}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedScope(itemValue)
                        let newRegion = "teste"
                        changedScope(itemValue, newRegion)
                    }}
                >
                    <Picker.Item label="Maceió" value="Maceió, Alagoas - Brasil" />
                    <Picker.Item label="Rio Largo" value="Rio Largo, Alagoas - Brasil" />
                    <Picker.Item label="Satuba" value="Satuba, Alagoas - Brasil" />
                </Picker>
            </View>
        </View>
    );
}