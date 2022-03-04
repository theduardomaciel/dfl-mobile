import React, { useEffect, useState } from "react";
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

import axios from "axios";
import { api } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";

import { Report, User } from "../../../@types/application";
import { LoadingScreen } from "../../../components/LoadingScreen";

type ImageUploadResponse = {
    deletehash: string;
    link: string;
}

type ReportResponse = {
    user: User;
    updatedReport: Report;
}

export function ReportScreen3({ route, navigation }: any) {
    const { data } = route.params;
    const { user, updateUser } = useAuth();
    const [modalOpen, setModalOpen] = useState(false)

    const [tags, setTags] = useState({});
    const handleTags = (tags) => {
        setTags(tags)
    }

    const [suggestion, setSuggestion] = useState("");
    const [hasTrashbin, setHasTrashbin] = useState(false);

    async function UploadImage() {
        try {
            const imageResponse = await api.post("/upload", { image_base64: data.image_base64, user_id: user.id });
            const { deletehash, link } = imageResponse.data as ImageUploadResponse;
            console.log(deletehash, link)
            return { deletehash, link }
        } catch (error) {
            console.log(error)
            return {
                deletehash: "",
                link: ""
            }
        }
    }

    const [isLoading, setIsLoading] = useState(false)

    const [gainedExperience, setGainedExperience] = useState(25 || null)
    async function SubmitReport(data: Report) {
        console.log("Iniciando processo de upload do relatório.")
        try {
            setIsLoading(true)
            const { deletehash, link } = await UploadImage()
            console.log(deletehash, link)
            if (!link) {
                console.log("Não foi possível realizar o upload da imagem do relatório. Uma possível causa é a ausência de token de autenticação. Retornando...")
                navigation.navigate("Início", { errorMessage: "Não foi possível realizar o upload da imagem do relatório. Por favor, tente novamente." })
                return "error"
            }
            const submitResponse = await api.post("/report/create", {
                user_id: user.id,
                coordinates: data.coordinates,
                address: data.address,
                image_url: link,
                image_deleteHash: deletehash,
                tags: data.tags,
                suggestion: data.suggestion,
                hasTrashbin: data.hasTrashBins
            })
            const response = submitResponse.data as ReportResponse
            const updatedUserProfile = response.user.profile
            console.log(user.profile.level, updatedUserProfile.level)
            if (updatedUserProfile.level > user.profile.level) {
                console.log("O usuário subiu de nível.")
                // Caso o usuário tenha subido de nível, indicamos que ele não ganhou nenhuma experiência, e realizamos a tratativa no modal
                setGainedExperience(null)
            } else {
                console.log("O usuário não subiu de nível.")
                // Caso não, somente mostramos o quanto o usuário ganhou de exp
                setGainedExperience(updatedUserProfile.experience - user.profile.experience)
            }
            await updateUser(response.user);
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            navigation.navigate("Início", { errorMessage: "Não foi possível cadastrar seu relatório. Tente novamente mais tarde :(" })
            return "error"
        }
    }

    useEffect(() => {
        navigation.addListener('beforeRemove', (event) => {
            if (isLoading) {
                // Prevent default behavior of leaving the screen
                event.preventDefault();
            } else {
                return;
            }
        })
    }, [navigation, isLoading])

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
                    onChangeText={setSuggestion}
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
                    onPress={setHasTrashbin}
                />
                <TextButton
                    title="Próximo passo"
                    colors={[theme.colors.secondary1, theme.colors.secondary2]}
                    buttonStyle={{ height: 55, width: "90%", }}
                    onPress={async () => {
                        data.tags = tags
                        data.hasTrashBins = hasTrashbin
                        data.suggestion = suggestion
                        const response = await SubmitReport(data);
                        if (response !== "error") {
                            setModalOpen(true)
                        }
                    }}
                />
                {
                    modalOpen && <Modal
                        transparent={false}
                        animationType={"slide"}
                        statusBarTranslucent
                    >
                        {
                            <ConclusionScreen
                                gainedExperience={gainedExperience}
                                title="O relato foi registrado com sucesso!"
                                info="Os órgãos responsáveis de sua cidade serão notificados."
                                onPress={() => {
                                    setModalOpen(false)
                                    if (gainedExperience === null) {
                                        navigation.navigate('NewLevel')
                                    } else {
                                        navigation.navigate('Início')
                                    }
                                }}
                            />
                        }
                    </Modal>
                }
            </ScrollView>
            {
                isLoading ? <LoadingScreen /> : null
            }
        </KeyboardAvoidingView>
    );
}