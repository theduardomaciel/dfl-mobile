import React, { ReactNode } from 'react';

import {
    View,
    Animated,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { theme } from '../../global/styles/theme';

import { styles } from './styles';

type Props = {
    data: Array<ReactNode>,
    scrollX: Animated.Value;
    scrollTo: (i: number) => void;
}

const { width } = Dimensions.get("window");

export function Paginator({ data, scrollX, scrollTo }: Props) {
    return (
        <View style={{ flexDirection: 'row', height: 28 }}>
            {data.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                /* const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp'
                }); */
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 10, 10],
                    extrapolate: 'clamp'
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp'
                });
                const backgroundColor = scrollX.interpolate({
                    inputRange,
                    outputRange: [theme.colors.gray_light, theme.colors.primary1, theme.colors.gray_light],
                    extrapolate: 'clamp'
                });
                return <Animated.View style={[styles.dot, { width: dotWidth, opacity, backgroundColor }]} key={index.toString()}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: "transparent" }} onPress={() => scrollTo(index)} />
                </Animated.View>;
            })}
        </View>
    );
}