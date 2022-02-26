import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { theme } from '../../global/styles/theme'

import { styles } from './styles'

export function LoadingScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.background} />
            <View style={styles.loadingBackground}>
                <ActivityIndicator size={"large"} color={theme.colors.primary1} animating={true} />
            </View>
        </View>
    )
}