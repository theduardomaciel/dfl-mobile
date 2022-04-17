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

export function AccordionOptions({ id, customHeader, accordionComponents, ...rest }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)

    const Header = () => (
        <View style={{ flex: 1, alignItems: "flex-start" }}>
            <MaterialIcons style={{ transform: [{ rotate: isExpanded ? '-90deg' : '0deg' }] }} name="keyboard-arrow-down" size={32} color={theme.colors.secondary1} />
        </View>
    );

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded)
    }
    return (
        <TouchableOpacity
            activeOpacity={0.7}
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