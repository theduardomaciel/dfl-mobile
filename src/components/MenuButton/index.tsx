import React from 'react';
import { SvgProps } from "react-native-svg";

import {
    Text,
    View,
} from 'react-native';

import { Feather } from '@expo/vector-icons'; 
import { styles } from './styles';

type Props = {
    image: React.FC<SvgProps>;
    title: string;
    isMiddleButton?: boolean;
    index: number;
};

import Trashbin_Vector from "../../assets/menu/trashbin.svg"

const icon_sizes = [
    [ 38, 38 ],
    [ 35, 38 ],
    [ 38, 38 ],
    [ 45, 37 ],
]

export function MenuButton({ image: Image, title, isMiddleButton, index }: Props) {
    const icon_size = icon_sizes[index]
    return (
        isMiddleButton ?
            <View style={[styles.container, { width: 80, height: 175 }]}>
                <Trashbin_Vector style={styles.svg} width={75} height={150} />
                <View style={styles.middleButtonIcon}>
                    <Feather name="plus" size={60} color="white" />
                </View>
                <Text style={[styles.title, { marginTop: 0 }]}> {title} </Text>
            </View>
        :
        <View style={styles.container}>
            <Trashbin_Vector style={styles.svg} width={75} height={150} />
            <Text style={styles.title}> {title} </Text>
            <View style={styles.icon}>
                <Image width={40} height={40} />
            </View>
        </View>
    );
}