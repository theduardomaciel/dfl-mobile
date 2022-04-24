import React from "react";
import { View, Text } from "react-native";

import { theme } from "../../../../global/styles/theme";

import { styles, triangleSize } from "../calloutStyles"
import TrashbinIcon from "../../../../assets/icons/trashbin.svg"

export function FocusCallout({ report }) {
    return (
        <View>
            <View style={[styles.calloutContainer, theme.shadowProperties]}>
                <Text style={styles.calloutTitle} numberOfLines={2}>
                    {report.address}
                </Text>
                <View style={[styles.calloutSubContainer, { justifyContent: "space-between" }]}>
                    <View style={styles.calloutSubContainer}>
                        <TrashbinIcon fill={theme.colors.primary3} width={18} height={18} />
                        <Text style={styles.calloutSubtitleTrashPoint}>
                            4.5
                        </Text>
                        <Text style={styles.calloutInfo}>
                            {` (42)`}
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