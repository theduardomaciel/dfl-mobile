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
    MapView?: React.Component<MapViewProps>;
}

export function MapScopePicker({ MapView }: CustomProps) {
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
                    console.log(itemValue)
                    // Função que altera o escopo do mapa
                    /* switch (key) {
                        case value:
                            
                            break;
                    
                        default:
                            break;
                    } */
                }}
            >
                <Picker.Item label="Bairro" value="neighborhood" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
                <Picker.Item label="Cidade" value="city" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
                <Picker.Item label="Estado" value="state" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
                <Picker.Item label="País" value="country" color={theme.colors.secondary1} fontFamily={theme.fonts.title700} />
            </Picker>
        </View>
    );
}