import React from 'react';
import { SvgProps } from "react-native-svg";

import {
    Text,
    View,
    Dimensions
} from 'react-native';

import { styles } from './styles';

type Props = {
    image: React.FC<SvgProps>;
    title: string;
    description: string;
    children?: React.ReactNode;
};

const { width } = Dimensions.get("window");

export function OnboardingItem({ image: Image, title, description, children }: Props) {
    return (
        <View style={[styles.container, { width: width }]}>
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