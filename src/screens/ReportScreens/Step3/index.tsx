import React, { useState } from "react";
import { View, Text, Modal, KeyboardAvoidingView, ScrollView } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { theme } from "../../../global/styles/theme";

import { defaultStyles } from "../defaultStyles";
import { styles } from "./styles";

import { AntDesign } from '@expo/vector-icons';
import { TextButton } from "../../../components/TextButton";
import { TagsSelector } from "../../../components/TagsSelector";
import { TextInput } from "react-native-gesture-handler";
import { ConclusionScreen } from "../../../components/ConclusionScreen";

export function ReportScreen3({ navigation, data }: any) {
    const [tags, setTags] = useState({});
    const [modalOpen, setModalOpen] = useState(false)
    function cacheInfo() {
        data.append("info", {

        })
        return data;
    }

    const handleTags = (tags) => {
        setTags(tags)
        console.log(tags)
    }

    let textInputRef;
    return (
        <KeyboardAvoidingView style={defaultStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={defaultStyles.safeView}>
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
                <TagsSelector onSelectTags={handleTags} />
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
                </View>
                <TextInput
                    ref={textInputRef}
                    style={styles.textForm}
                />
                <BouncyCheckbox
                    size={30}
                    style={{ width: "92%", marginBottom: 15 }}
                    fillColor={theme.colors.secondary1}
                    unfillColor={theme.colors.background2}
                    text="O local possui lixeiras ou pontos de coleta de lixo"
                    textStyle={{
                        textDecorationLine: "none",
                        fontFamily: theme.fonts.subtitle400,
                        fontSize: 13
                    }}
                    iconStyle={{ borderRadius: 10 }}
                    onPress={(isChecked: boolean) => { }}
                />
                <TextButton
                    title="Próximo passo"
                    colors={[theme.colors.secondary1, theme.colors.secondary2]}
                    buttonStyle={{ height: 55, width: "90%", }}
                    onPress={() => {
                        //const cache = cachePicture()
                        setModalOpen(true)
                    }}
                />
                {
                    modalOpen && <Modal
                        transparent={false}
                        animationType={"slide"}
                        statusBarTranslucent
                    >
                        <ConclusionScreen title="O relato foi registrado com sucesso!" info="Os órgãos responsáveis de sua cidade serão notificados." onPress={() => {
                            navigation.navigate('Início')
                            setModalOpen(false)
                        }} />
                    </Modal>
                }
            </ScrollView>
        </KeyboardAvoidingView>
    );
}