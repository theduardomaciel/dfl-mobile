import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Image } from "react-native";

import { ProfileIcon } from "../../components/ProfileIcon";
import { SectionTitle } from "../../components/SectionTitle";
import { TextForm } from "../../components/TextForm";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

export function Account() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ProfileIcon uri="https://github.com/theduardomaciel.png" />
                <Text style={styles.title}>
                    nomedousuário
                </Text>
            </View>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} >
                <SectionTitle title="Dados Pessoais" />
                <TextForm style={{ width: "90%" }} title="Nome" placeholder="Nome" titleStyle={styles.subtitle} />
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}