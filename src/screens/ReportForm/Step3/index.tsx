import React, { useEffect, useState } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { theme } from "../../../global/styles/theme";

import { defaultStyles } from "../defaultStyles";
import { styles } from "./styles";

import { AntDesign } from '@expo/vector-icons';
import { TextButton } from "../../../components/TextButton";
import { TagsSelector } from "../../../components/TagsSelector";
import { TextInput } from "react-native-gesture-handler";

import { LoadingScreen } from "../../../components/LoadingScreen";
import SubmitReport from "./SubmitReport";
import { useAuth } from "../../../hooks/useAuth";
import FocusAwareStatusBar from "../../../utils/functions/FocusAwareStatusBar";

export function ReportScreen3({ route, navigation }: any) {
    const { user, updateProfile } = useAuth();
    const { data } = route.params;

    const [isLoading, setIsLoading] = useState(false)

    const [tags, setTags] = useState({});
    const handleTags = (tags) => {
        setTags(tags)
    }

    const [suggestion, setSuggestion] = useState("");
    const [hasTrashbin, setHasTrashbin] = useState(false);

    async function EndForm() {
        setIsLoading(true)
        data.tags = tags
        data.hasTrashBins = hasTrashbin
        data.suggestion = suggestion
        const response = await SubmitReport(data, user.profile)
        if (response === "error") {
            console.log("Deu erro :(")
            navigation.navigate("Início" as never, { errorMessage: `Infelizmente não foi cadastrar seu relatório :(\nPor favor, tente novamente mais tarde.` })
        } else {
            await updateProfile(response)
            setIsLoading(false)
            const pageToNavigate = response === null ? "Main" : "NewLevel"
            navigation.navigate("ConclusionScreen", {
                title: "O relatório foi enviado com sucesso!",
                info: "Obrigado por contribuir com o meio ambiente!",
                gainedExperience: response.experience - user.profile.experience,
                navigateTo: pageToNavigate,
            })
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
        <KeyboardAvoidingView style={defaultStyles.container} behavior={"height"}>
            <FocusAwareStatusBar translucent backgroundColor={"transparent"} barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} style={defaultStyles.safeView}>
                <View style={defaultStyles.header}>
                    <Text style={defaultStyles.stepTitle}>3 | INFORMAÇÕES</Text>
                    <AntDesign name="close" size={24} color={theme.colors.primary1} onPress={() => navigation.navigate("Main")} />
                </View>
                <Text style={defaultStyles.subtitle}>
                    Este passo é opcional, porém muito importante.
                </Text>
                <Text style={[defaultStyles.title, { marginBottom: 5 }]}>
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
                <View style={{}}>
                    <TextInput
                        multiline
                        style={styles.textForm}
                        onChangeText={setSuggestion}
                    />
                </View>
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
                    title="Enviar Relatório"
                    colors={[theme.colors.secondary1, theme.colors.secondary2]}
                    textStyle={{ fontSize: 18 }}
                    buttonStyle={{ height: 55, width: "90%" }}
                    onPress={EndForm}
                />
            </ScrollView>
            {
                isLoading ? <LoadingScreen /> : null
            }
        </KeyboardAvoidingView>
    );
}