import React, { useState } from 'react';

import { Text, TouchableOpacity, TouchableOpacityProps, View, LayoutAnimation, Platform, UIManager } from 'react-native';

import { styles } from './styles';

type Props = TouchableOpacityProps & {
    // A ? faz com que o elemento não seja obrigatório
    header: React.ReactNode;
    accordionComponents?: React.ReactNode;
    id: string;
}

export function AccordionOptions({ id, header, accordionComponents, ...rest }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded)
    }
    return (
        <TouchableOpacity activeOpacity={0.7} style={id === "0" ? [styles.container, { marginTop: 35 }] : styles.container} onPress={toggleExpand} {...rest}>
            {
                isExpanded ?
                    <View style={{ flex: 1 }}>
                        {header}
                        {accordionComponents}
                    </View>
                    : header
            }
        </TouchableOpacity>
    )
}