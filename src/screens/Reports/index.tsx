import React from "react";
import { View, StatusBar } from "react-native";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

export function Reports() {
    StatusBar.setBackgroundColor(theme.colors.secondary1, true)
    StatusBar.setBarStyle("light-content")
    return (
        <View style={styles.container}>

        </View>
    );
}