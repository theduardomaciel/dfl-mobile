import React from 'react';

import {
    View,
    Text
} from 'react-native';

import { theme } from '../../../global/styles/theme';
import { styles } from './styles';
import { defaultStyles } from '../pickerDefaultStyles';

import { TextInput } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export const MIN_USERNAME_CHARACTERS = 3;
export const MAX_USERNAME_CHARACTERS = 16

export function verifyRange(usernameText) {
    return usernameText.length > MAX_USERNAME_CHARACTERS || usernameText.length < MIN_USERNAME_CHARACTERS
}
export function verifyFormatting(usernameText) {
    //return (usernameText.includes(" ") || usernameText.toLowerCase() !== usernameText)
    return (usernameText.includes(" "))
}

type CustomProps = {
    usernameState: React.Dispatch<React.SetStateAction<string>>;
}

export function UsernamePicker({ usernameState, ...props }: CustomProps) {

    const offset = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: withSpring(offset.value, {
                    mass: 0.5,
                    stiffness: 85,
                })
            }],
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <Text style={defaultStyles.title}>
                Nome de Usuário
            </Text>
            <TextInput
                onChangeText={usernameState}
                placeholder='nomedeusuário'
                textAlign='center'
                onFocus={() => {
                    offset.value = -100
                }}
                onBlur={() => {
                    offset.value = 0
                }}
                autoCapitalize={"none"}
                maxLength={MAX_USERNAME_CHARACTERS}
                style={[defaultStyles.picker, { width: 250 }, theme.shadowPropertiesLow]}
            />
        </Animated.View>
    );
}