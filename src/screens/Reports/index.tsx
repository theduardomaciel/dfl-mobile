import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, ScrollView, Image } from "react-native";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

export function Reports() {
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={theme.colors.secondary1}
            />

        </View>
    );
}