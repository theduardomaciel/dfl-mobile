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
    children?: React.ReactNode;
};


export function OnboardingItem({ image: Image, title, description, children }: Props) {
    const { width } = useWindowDimensions();
    return (
        <View style={[styles.container, { width }]}>
            <View>
                <Text style={styles.title}> {title} </Text>
                <Text style={styles.description}> {description} </Text>
            </View>
            {
                children ? children : null
            }
            <View style={styles.svg} >
                <Image width={width} />
            </View>
        </View>
    );
}