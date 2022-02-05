import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker'
import MapView, { MapViewProps } from 'react-native-maps'

import {
    Text,
    View,
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';

type CustomProps<T = string | number> = {
    //onValueChange?: (itemValue: T, itemIndex: number) => void;
    //MapView?: React.Component<MapViewProps>;
    biggerScope?: boolean;
    setMapRegion: any;
    actualRegion: any;
}

export function MapScopePicker({ biggerScope, actualRegion, setMapRegion }: CustomProps) {
    const [selectedScope, setSelectedScope] = useState();
    return (
        <View style={styles.scopeButton}>
            <Picker
                style={{ width: 135, color: theme.colors.text1, fontFamily: theme.fonts.title700 }}
                mode={"dropdown"}
                dropdownIconColor={theme.colors.text1}
                selectedValue={selectedScope}
                onValueChange={(itemValue, itemIndex) => {
                    if (!actualRegion) return;
                    console.log("Alterando escopo do mapa.")
                    setSelectedScope(itemValue)
                    // Função que altera o escopo do mapa
                    let newRegion;
                    if (itemValue === 'state') {
                        newRegion = {
                            latitude: actualRegion.latitude,
                            longitude: actualRegion.longitude,
                            latitudeDelta: 2,
                            longitudeDelta: 2
                        }
                    } else if (itemValue === 'city') {
                        newRegion = {
                            latitude: actualRegion.latitude,
                            longitude: actualRegion.longitude,
                            latitudeDelta: 0.25,
                            longitudeDelta: 0.25
                        }
                    } else if (itemValue === 'neighbrhood') {
                        newRegion = {
                            latitude: actualRegion.latitude,
                            longitude: actualRegion.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        }
                    }
                    setMapRegion(newRegion)
                }}
            >
                <Picker.Item label="Bairro" value="neighborhood" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
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