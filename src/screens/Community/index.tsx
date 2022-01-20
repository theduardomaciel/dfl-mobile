import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Image } from "react-native";

//import MapView from "react-native-maps";

import { ProfileIcon } from "../../components/ProfileIcon";
import { SectionTitle } from "../../components/SectionTitle";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";
//import { useNavigation, useFocusEffect } from "@react-navigation/core";

export function Community() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Comunidade
                </Text>
            </View>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} >
                <SectionTitle title="Sua Cidade" info="212 usuários" />
                <View style={elements.subContainerGreen}>

                </View>

                <SectionTitle title="Enquetes" info="termina em 12h31m" />
                <View style={elements.subContainerWhite}>

                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}