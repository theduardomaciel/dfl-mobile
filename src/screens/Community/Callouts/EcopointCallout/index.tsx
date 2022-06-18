import React from "react";
import { View, Text } from "react-native";

import { theme } from "../../../../global/styles/theme";
import { styles, triangleSize } from "../calloutStyles"

import { MaterialIcons } from "@expo/vector-icons"

export function FocusCallout({ report }) {
    return (
        <View>
            <View style={[styles.calloutContainer, theme.shadowProperties]}>
                <Text style={styles.calloutTitle} numberOfLines={2}>
                    {report.address}
                </Text>
                <View style={[styles.calloutSubContainer, { justifyContent: "space-between" }]}>
                    <View style={styles.calloutSubContainer}>
                        <MaterialIcons name="call" color={theme.colors.secondary1} size={18} />
                        <Text style={styles.calloutSubtitleEcoPoint}>
                            0800 082 2600
                        </Text>
                    </View>
                    <Text style={styles.calloutInfo}>
                        {`225m`}
                    </Text>
                </View>
                <View style={styles.triangle} />
                <View style={styles.calloutFooter} />
            </View>
            <View style={{ height: triangleSize }} />
        </View>
    )
}