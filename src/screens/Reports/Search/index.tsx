import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    LayoutAnimation,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

import { elements } from "../../../global/styles/elements";
import { theme } from "../../../global/styles/theme";

import { MaterialIcons } from "@expo/vector-icons"
import TrashBinSvg from "../../../assets/icons/trashbin.svg"

import { useAuth } from "../../../hooks/useAuth";
import { styles } from "./styles";

import { styles as defaultStyles } from "../styles";
import { TextForm } from "../../../components/TextForm";
import { api } from "../../../utils/api";
import { Report } from "../../../@types/application";
import GetRatingsAverage from "../../../utils/functions/GetRatingsAverage";
import FocusAwareStatusBar from "../../../utils/functions/FocusAwareStatusBar";

const FAKE_DATA = [
    {
        id: 0,
        address: "endereço legal, rua tal",
        suggestion: "essa sugestão aqui ó: [nenhuma~~]",
        image_url: "https://github.com/theduardomaciel.png",
        profile: {
            username: "carinhaquepostou",
            image_url: "https://github.com/theduardomaciel.png"
        }
    },
    {
        id: 1,
        address: "endereço legal, rua tal",
        suggestion: "",
        image_url: "https://i.ytimg.com/vi/Ey2MT0NsO7g/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDIDYTFLPqVQlKqPvBpsVfoyXezvA",
        profile: {
            username: "caradomeio",
            image_url: "https://github.com/theduardomaciel.png"
        }
    },
    {
        id: 2,
        address: "endereço legal, rua tal",
        suggestion: "essa sugestão aqui ó: [nenhuma~~]",
        image_url: "https://github.com/theduardomaciel.png",
        profile: {
            username: "carinhaquepostou",
            image_url: "https://github.com/theduardomaciel.png"
        }
    }
]

export function Search({ route, navigation }) {
    const search = route.params?.search;
    const { user } = useAuth();

    useEffect(() => {
        if (user.profile === undefined) {
            return navigation.goBack();
        }
    }, [])

    /* if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); */

    const [results, setResults] = useState([])

    async function GetResults(incrementResults?: boolean, newSearch?: string) {
        try {
            const searchOject = newSearch ? newSearch.replace(/ /g, '') : search.replace(/ /g, '')
            console.log("Iniciando pesquisa do usuário com o(s) termo(s): ", searchOject)

            /* const newResults = await api.post("/reports/search", {
                location: searchOject,
                username: searchOject,
                // Condição 1: Novos - Excluímos os relatórios já adicionados em buscas anteriores
                exclusionsId: results !== null ? results.map(report => report.id) : [],
                // Condição 2: Usuário - Excluímos os relatórios criados pelo próprio usuário
                //profileToExcludeId: user.profile.id
                includeInfo: true
            }, { timeout: 10 * 1000, timeoutErrorMessage: "O tempo limite de espera do servidor foi atingido." }) */

            const newResults = await api.get(`/report?location=${searchOject}&username=${searchOject}${results && results.length > 0 ? `&exclusionsId=${results.map(report => report.id)}` : ""}&includeInfo=true`,
                { timeout: 10 * 1000, timeoutErrorMessage: "O tempo limite de espera do servidor foi atingido." })

            const moreReports = newResults.data as Array<Report>;
            console.log("Obtivemos os resultados.", moreReports)
            if (incrementResults) {
                console.log(`➕ Adicionando novos relatórios aos resultados da pesquisa.`)
                setResults(results.concat(moreReports))
            } else {
                console.log(`Renovando resultados da pequisa.`)
                if (moreReports.length === 0) {
                    setResults(null)
                } else {
                    setResults(moreReports)
                }
            }
        } catch (error) {
            console.log(error)
            setResults(null)
        }
    }

    useEffect(() => {
        GetResults()
    }, [])

    const renderFooter = ({ item, index }) => {
        return (
            results !== null ?
                results.length === 0 ?
                    <View key={index} style={{ paddingVertical: 10 }}>
                        <ActivityIndicator size={"large"} color={theme.colors.secondary1} />
                    </View>
                    : null
                : null
        )
    }

    const renderItem = ({ item, index }) => {
        const report = item as Report
        return (
            <TouchableOpacity activeOpacity={0.8} key={index} style={styles.previewContainer} onPress={() => {
                navigation.navigate("Report", { item })
            }}>
                <View style={styles.preview}>
                    <Image source={{ uri: report.images_urls[0] }} style={{ flex: 1 }} />
                    <View style={styles.previewRatingView}>
                        <TrashBinSvg height={28} width={28} fill={theme.colors.text1} />
                        <Text style={[styles.previewSubTitle, { color: theme.colors.text1 }, theme.shadowPropertiesLow]}>{GetRatingsAverage(item)}</Text>
                    </View>
                </View>
                <Text style={styles.previewText}>
                    {report.suggestion && report.suggestion !== "" ? report.suggestion : `📍${report.address}`}
                </Text>

                <View style={{ flexDirection: "row" }}>
                    <View style={styles.previewProfileImage}>
                        <Image
                            progressiveRenderingEnabled
                            style={{ flex: 1 }}
                            source={{
                                uri: item.profile.image_url,
                            }}
                        />
                    </View>
                    <Text style={styles.previewSubTitle}>{report.profile.username}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const EmptyItem = () => {
        return (
            results === null &&
            <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", height: Dimensions.get("window").height - 125 }}>
                <TrashBinSvg
                    fill={theme.colors.secondary1}
                    width={40}
                    height={80}
                />
                <Text style={{
                    fontFamily: theme.fonts.title700,
                    color: theme.colors.secondary1,
                    fontSize: 18,
                    textAlign: "center",
                }}>
                    Está um pouco vazio aqui...
                </Text>
                <Text style={{
                    fontFamily: theme.fonts.subtitle400,
                    color: theme.colors.secondary1,
                    fontSize: 16,
                    textAlign: "center",
                }}>
                    {`Que tal pesquisar alguma outra coisa?`}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar translucent backgroundColor={"transparent"} barStyle="dark-content" />
            <View style={{ flexDirection: "row", marginTop: 45, width: "95%", alignSelf: "center" }}>
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={38}
                    style={{ marginRight: 5 }}
                    color={theme.colors.secondary1}
                    onPress={() => { navigation.goBack() }}
                />
                <TextForm
                    customStyle={styles.searchBar}
                    textInputProps={{
                        defaultValue: search,
                        placeholder: `Pesquisar relatos (ex.: bairro, cidade, estado)`,
                        placeholderTextColor: theme.colors.gray_light,
                        autoCapitalize: "none",
                        onSubmitEditing: ({ nativeEvent: { text } }) => {
                            const shouldGetResults = text && text.length > 0
                            setResults([]) // Definimos os resultados como [] para que a rodinha de carregamento apareça
                            if (shouldGetResults) GetResults(false, text)
                        }
                    }}
                    icon={<MaterialIcons name="search" size={24} color={theme.colors.secondary1} />}
                />
            </View>
            <FlatList
                data={results}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => (item.id)}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={EmptyItem}
                onEndReached={() => { GetResults(true) }}
                onEndReachedThreshold={0}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                style={{ marginTop: 15, paddingHorizontal: 15 }}
            />
            {/* <Text style={[styles.previewText, { textAlign: "center" }]}>{`A pesquisa sem o uso de acentos ainda não é suportada.\nRealize sua pesquisa digitando as palavras com o uso dos acentos.`}</Text> */}
        </View>
    );
}