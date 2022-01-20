import React from 'react';
import { useNavigation } from '@react-navigation/native';

import {
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

type Props = {
    uri: string;
}

export function ProfileIcon({ uri }: Props) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={() => {
                navigation.navigate("Conta")
            }}
        >
            <Image
                style={styles.logo}
                source={{
                    uri: uri,
                }}
            />
        </TouchableOpacity>
    );
}

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "transparent",
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
});