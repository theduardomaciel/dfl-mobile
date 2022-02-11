import React, { useState } from 'react';

import { Text, TouchableOpacity, TouchableOpacityProps, View, LayoutAnimation, Platform, UIManager } from 'react-native';

import { styles } from './styles';

type Props = TouchableOpacityProps & {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    description: string;
    accordionComponents?: React.ReactNode;
    icon: any;
    id: string;
}

export function ConfigOption({ title, id, description, accordionComponents, icon, ...rest }: Props) {
    const [isExpanded, setIsExpanded] = useState(false)

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded)
    }
    const component =
        <View style={{ flexDirection: "row", }}>
            {icon}
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    return (
        <TouchableOpacity activeOpacity={0.7} style={id === "0" ? [styles.container, { marginTop: 35 }] : styles.container} onPress={toggleExpand} {...rest}>
            {
                accordionComponents ?
                    isExpanded ? <View style={{ flex: 1 }}>
                        {component}
                        {accordionComponents}
                    </View>
                        : component
                    : component
            }
        </TouchableOpacity>
    )
}