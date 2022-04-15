import React, { Dispatch, SetStateAction } from 'react';

import {
    View,
    Text
} from 'react-native';

import { theme } from '../../../global/styles/theme';
import { styles } from './styles';
import { defaultStyles } from '../defaultStyles';

import { TextInput } from 'react-native-gesture-handler';

export const MIN_USERNAME_CHARACTERS = 3;
export const MAX_USERNAME_CHARACTERS = 12

export function verifyRange(usernameText) {
    return usernameText.length > MAX_USERNAME_CHARACTERS || usernameText.length < MIN_USERNAME_CHARACTERS
}
export function verifyFormatting(usernameText) {
    return (usernameText.includes(" ") || usernameText.toLowerCase() !== usernameText)
}

type CustomProps = {
    usernameState: React.Dispatch<React.SetStateAction<string>>;
}

export function UsernamePicker({ usernameState }: CustomProps) {
    return (
        <View style={styles.container}>
            <Text style={defaultStyles.title}>
                Nome de Usuário
            </Text>
            <TextInput onChangeText={usernameState}
                placeholder='nomedeusuário'
                textAlign='center'
                autoCapitalize={"none"}
                maxLength={MAX_USERNAME_CHARACTERS}
                style={[defaultStyles.picker, { width: 250 }, theme.shadowPropertiesLow]}
            />
        </View>
    );
}