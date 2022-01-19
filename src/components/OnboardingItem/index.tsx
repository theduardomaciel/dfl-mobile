import React from 'react';
import { SvgProps } from "react-native-svg";

import {
    Text,
    View,
    useWindowDimensions
} from 'react-native';

import { styles } from './styles';

type Props = {
    image: React.FC<SvgProps>;
    title: string;
    description: string;
};


export function OnboardingItem({ image: Image, title, description }: Props) {
    const { width } = useWindowDimensions();
    return (
        <View style={[styles.container, { width }]}>
            <View>
                <Text style={styles.title}> {title} </Text>
                <Text style={styles.description}> {description} </Text>
            </View>
            <View style={styles.svg} >
                <Image width={width} />
            </View>
        </View>
    );
}