import React from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

type Props = {
    uri: string;
}

export function ProfileIcon({ uri }: Props) {
    return (
        <TouchableOpacity style={styles.container}>
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