import React, { useState } from "react";
import { View, Text, ScrollView, Image, RefreshControl, TouchableOpacity } from "react-native";
import { MapScopePicker } from "../../components/MapScopePicker";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { ProfileIcon } from "../../components/ProfileIcon";
import { TextButton } from "../../components/TextButton";
import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

export function PermissionsExplanation() {
    const Bold = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
    const PermissionElement = (icon, title, description, footer) => {
        <View>
            <View style={styles.header}>
                {icon}
                {title}
            </View>
            <Text>{description}</Text>
            <View style={styles.header}>
                { /* icone da setinha aqui */}
                {footer}
            </View>
        </View>
    }
    return (
        <View style={styles.container}>
            <View style={styles.elementsContainer}>
                <Text style={styles.title}>
                    Antes de começar, precisamos de algumas <Bold>permissões.</Bold>
                </Text>
                <Text style={styles.subtitle}>
                    Só pediremos o necessário e não se preocupe, está tudo explicadinho aqui em baixo pra você ficar por dentro de tudo.
                </Text>
                <View style={styles.line} />
            </View>
        </View>
    );
}