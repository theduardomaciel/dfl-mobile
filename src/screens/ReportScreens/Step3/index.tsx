import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { View, Text } from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';

import { theme } from "../../../global/styles/theme";

import { defaultStyles } from "../defaultStyles";
import { styles } from "./styles";

import { AntDesign } from '@expo/vector-icons';
import { BottomBar } from "../../../components/BottomBar";
import { TextButton } from "../../../components/TextButton";
import { TagsSelector } from "../../../components/TagsSelector";
import { TextForm } from "../../../components/TextForm";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "native-base";

export function ReportScreen3({ navigation, data }: any) {

    function cacheInfo() {
        data.append("info", {

        })
        return data;
    }

    return (
        <KeyboardAvoidingView style={defaultStyles.container}>
            <View style={defaultStyles.safeView}>
                <View style={defaultStyles.header}>
                    <Text style={defaultStyles.stepTitle}>3 | INFORMAÇÕES</Text>
                    <AntDesign name="left" size={24} color={theme.colors.primary1} onPress={() => navigation.goBack()} />
                </View>
                <Text style={defaultStyles.subtitle}>
                    Este passo é opcional, porém muito importante.
                </Text>
                <Text style={defaultStyles.title}>
                    Selecione as tags que possuem relação com a situação do foco de lixo.
                </Text>
                <TagsSelector />
                <View>
                    <Text style={defaultStyles.subtitle}>
                        Quer ser um pouco mais descritivo?
                    </Text>
                    <Text style={[defaultStyles.title, { lineHeight: 30, marginBottom: 1 }]}>
                        Insira mais dados abaixo.
                    </Text>
                    <Text style={styles.description}>
                        Busque descrever como você acha que o problema pode ser resolvido.
                    </Text>
                    <TextInput
                        style={styles.textForm}
                    />
                </View>
                <TextButton
                    title="Próximo passo"
                    style={theme.shadowProperties}
                    colors={[theme.colors.secondary1, theme.colors.secondary2]}
                    buttonStyle={{ height: 45, width: "90%", }}
                    onPress={() => {
                        //const cache = cachePicture()
                        navigation.navigate("Step3")
                    }}
                />
            </View>
        </KeyboardAvoidingView>
    );
}