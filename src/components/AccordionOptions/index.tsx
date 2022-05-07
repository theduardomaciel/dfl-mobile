import React, { useState } from 'react';

import { TouchableOpacity, TouchableOpacityProps, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { theme } from '../../global/styles/theme';

import { styles } from './styles';

type Props = TouchableOpacityProps & {
    customHeader?: React.ReactNode;
    accordionComponents?: React.ReactNode;
    id: string;
}

import { MaterialIcons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export function AccordionOptions({ id, customHeader, accordionComponents, ...rest }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)

    const arrowRotation = useSharedValue(0);
    const arrowRotationStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${arrowRotation.value}deg`
                },
            ],
        };
    });

    const Header = () => (
        <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Animated.View style={arrowRotationStyle}>
                <MaterialIcons name="keyboard-arrow-down" size={32} color={theme.colors.secondary1} />
            </Animated.View>
        </View>
    );

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
        if (!isExpanded) {
            arrowRotation.value = withTiming(-90)
        } else {
            arrowRotation.value = withTiming(0)
        }
        LayoutAnimation.configureNext(LayoutAnimation.create(250, LayoutAnimation.Types.easeOut, LayoutAnimation.Properties.opacity));
    }
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={id === "0" ? [styles.container, { marginTop: 35 }] : styles.container}
            onPress={toggleExpand}
            {...rest}
        >
            {
                isExpanded ?
                    <View style={{ flex: 1 }}>
                        {
                            customHeader ? customHeader : <Header />
                        }
                        {accordionComponents}
                    </View>
                    : customHeader ? customHeader : <Header />
            }
        </TouchableOpacity>
    )
}