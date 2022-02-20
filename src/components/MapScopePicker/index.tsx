import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker'
import MapView, { MapViewProps } from 'react-native-maps'

import {
    Text,
    View,
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type RegionType = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

type CustomProps = {
    changedScope: (scope, newRegion) => void;
    actualRegion: RegionType;
    biggerScope?: boolean;
}

export function MapScopePicker({ actualRegion, changedScope, biggerScope }: CustomProps) {
    const [selectedScope, setSelectedScope] = useState();
    return (
        <View style={styles.scopeButton}>
            <Picker
                style={{ width: 135, color: theme.colors.text1, fontFamily: theme.fonts.title700 }}
                mode={"dropdown"}
                dropdownIconColor={theme.colors.text1}
                selectedValue={selectedScope}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedScope(itemValue)
                    // Função que altera o escopo do mapa
                    let newRegion = Object.assign({}, actualRegion)
                    switch (itemValue) {
                        case 'neighbourhood':
                            newRegion.latitudeDelta = 0.025
                            newRegion.longitudeDelta = 0.025
                            break;
                        case 'city':
                            newRegion.latitudeDelta = 0.25
                            newRegion.longitudeDelta = 0.25
                            break;
                        case 'state':
                            newRegion.latitudeDelta = 0.75
                            newRegion.longitudeDelta = 0.75
                            break;
                        case 'country':
                            newRegion.latitudeDelta = 10
                            newRegion.longitudeDelta = 10
                            break;
                    }
                    //console.log(`Atualizando escopo do mapa para ${itemValue}`, newRegion)
                    changedScope(itemValue, newRegion)
                }}
            >
                <Picker.Item label="Bairro" value="neighbourhood" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
                <Picker.Item label="Cidade" value="city" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
                <Picker.Item label="Estado" value="state" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
                {
                    biggerScope ? <Picker.Item label="País" value="country" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
                        : null
                }
            </Picker>
        </View>
    );
}