import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Dimensions, Image, ViewToken, ActivityIndicator, Pressable } from "react-native";
import { TextForm } from "../../components/TextForm";
import * as FileSystem from 'expo-file-system';

import TrashBinSVG from "../../assets/icons/trashbin.svg"
import { theme } from "../../global/styles/theme";
import { styles } from "./styles";

import Toast from 'react-native-toast-message';
import Share from 'react-native-share';

import { MaterialIcons } from "@expo/vector-icons"
import { backgroundDrivers, TAB_BAR_HEIGHT_LONG } from "../../components/TabBar";

import { api } from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";

import { CommentsModal } from "./Comments/Modal";
import { Report } from "../../@types/application";
import { LoadingScreen } from "../../components/LoadingScreen";
import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";

type PropTypes = {
    viewableItems: Array<ViewToken>;
}
import { useFocusEffect } from '@react-navigation/native';
import { UpdateNavigationBar } from "../../utils/functions/UpdateNavigationBar";
import RatingFrame from "./RatingFrame";
import GetRatingsAverage from "../../utils/functions/GetRatingsAverage";

let lastIndex = 0;

export const shareReport = async (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, report: Report) => {
    setIsLoading(true)
    FileSystem.downloadAsync(
        report.images_urls[0],
        FileSystem.documentDirectory + 'report_image'
    )
        .then(async ({ uri }) => {
            console.log('Finished downloading to ', uri);
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
            const base64Data = `data:image/png;base64,` + base64;
            Share.open({
                url: base64Data,
                message: `Olha esse foco de lixo que vi em *${report.address}*!\nEncontrei ele pelo aplicativo *DFL - Detector de Focos de Lixo*, que envia relatórios de focos de lixo relatados pela comunidade para a prefeitura.\n*Que tal baixar e avaliar esse foco pra que ele seja resolvido mais rápido?*\nhttps://dfl.vercel.app`,
                title: `Olha esse foco de lixo que tá em ${report.address}!`
            })
                .then((response) => {
                    console.log(response);
                    setIsLoading(false)
                })
                .catch((error) => {
                    error && console.log(error, "Houve uma ocorrência ao compartilhar a imagem baixada.");
                    setIsLoading(false)
                });
            FileSystem.deleteAsync(uri, { idempotent: true }) // idempotent faz com que a imagem seja apagada mesmo que ela já exista no dispositivo
        })
        .catch(error => {
            console.error(error, "Houve um erro ao baixar a imagem.");
        });
}

export function Reports({ route, navigation }) {
    const { user } = useAuth();

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<Array<Report>>([])
    async function loadMoreReports() {
        try {
            console.log(data, data.length)
            const moreReportsResponse = await api.get(`/report?location=${`Brasil`}${data.length > 0 ? `&exclusionsId=${data.map(report => report.id)}` : ""}&includeInfo=true`)
            // Condição 1: Local - utilizamos o Brasil inteiro como local de busca
            // Condição 2: Novos - Excluímos os relatórios já adicionados em buscas anteriores
            // Condição 3: Usuário - Excluímos os relatórios criados pelo próprio usuário
            //profileToExcludeId: user.profile.id
            const moreReports = moreReportsResponse.data as Array<Report>;
            if (moreReports.length > 0) {
                if (data.length > 0) {
                    console.log(`➕ Adicionando novos relatórios à array de 'data'.`)
                    setData(data.concat(moreReports.filter(report => report.profile !== null)))
                } else {
                    console.log(`✌️ Inserindo relatórios à array de 'data' pela primeira vez.`)
                    setData(moreReports)
                }
            } else {
                showToast();
            }
        } catch (error) {
            console.log("Não foi possível conectar-se ao servidor para obter relatórios próximos ao usuário.", error, error.response.status)
            showErrorToast()
        }
    }

    const renderFooter = ({ item, index }) => {
        return (
            data.length > 0 &&
            <View key={index} style={{ paddingVertical: 10, marginBottom: 5, backgroundColor: "black" }}>
                <ActivityIndicator size={"large"} color={theme.colors.text1} />
            </View>
        )
    }

    const [isTabBarVisible, setTabBarVisible] = useState(false)
    useEffect(() => {
        backgroundDrivers[0].addListener((value) => {
            if (value.value === 1) {
                setTabBarVisible(true)
            } else {
                setTabBarVisible(false)
            }
        })
    }, [])

    const shouldLoadData = data && data.length === 0
    useFocusEffect(
        useCallback(() => {
            if (shouldLoadData) loadMoreReports()
            UpdateNavigationBar("dark", true, "black")
            UpdateNavigationBar("dark", false, "black")
        }, [data])
    );

    const [rating, setRating] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList<any>>(null);
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        if (viewableItems[0]) {
            return setCurrentIndex(viewableItems[0].index)
        }
    }, []);

    useEffect(() => {
        async function UpdateReport() {
            if (rating !== 0) {
                console.log("Atualizando relatório")
                const response = await api.patch(`/report/${data[lastIndex].id}`, {
                    profile_id: user.profile.id,
                    rating: rating,
                })
                const updatedReport = response.data as Report;
                if (updatedReport) {
                    const updatedData = data;
                    updatedData[lastIndex] = updatedReport
                    updatedData[lastIndex][`note${rating}`] = updatedReport[`note${rating}`] + 1
                    setData(updatedData)

                    lastIndex = currentIndex
                    setRating(0)
                    console.log("Relatório atualizado com sucesso.")
                }
            }
        }

        if (data.length > 0) {
            UpdateReport();
        }
    }, [currentIndex])

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const dimensions = Dimensions.get("screen")
    const TOLERANCE = 15 // Tolerância que damos para que as imagens fiquem por trás das bordas arredondadas 

    const IMAGE_HEIGHT = dimensions.height - TAB_BAR_HEIGHT_LONG + TOLERANCE

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ height: IMAGE_HEIGHT }}>
                {/* backgroundColor: index % 2 == 0 ? "blue" : "green", */}
                <Image
                    progressiveRenderingEnabled
                    style={{
                        flex: 1,
                        resizeMode: "cover"
                    }}
                    source={{ uri: item.images_urls[0] }}
                />
            </View>
        )
    }

    const showToast = () => {
        console.log("Mostrando toast de aviso.")
        Toast.show({
            type: 'info',
            text1: 'Eita! Calma aí...',
            text2: 'Não há mais nenhum relatório pra carregar!',
        });
    }

    const showErrorToast = () => {
        console.log("Mostrando toast de erro.")
        Toast.show({
            type: 'error',
            text1: 'Eita! Não foi possível obter relatórios para você :(',
            text2: 'Verifique sua conexão com a internet e tente novamente.',
        });
    }

    const [isCommentsModalVisible, setCommentsModalVisible] = useState(false)
    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />
            <View style={{ height: IMAGE_HEIGHT, width: "100%", backgroundColor: theme.colors.background }}>
                <FlatList
                    pagingEnabled
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    scrollEventThrottle={50}
                    keyExtractor={(item, index) => index.toString()}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    viewabilityConfig={viewabilityConfig}
                    ref={flatListRef}
                    ListFooterComponent={renderFooter}
                    onEndReached={loadMoreReports}
                    onEndReachedThreshold={0}
                />
            </View>

            <TextForm
                customStyle={styles.searchBar}
                textInputProps={{
                    placeholder: `Pesquisar relatos (ex.: bairro, cidade, estado)`,
                    placeholderTextColor: theme.colors.gray_light,
                    autoCapitalize: "none",
                    onSubmitEditing: ({ nativeEvent: { text } }) => { text.length > 0 && navigation.navigate("Search", { search: text }) }
                }}
                icon={<MaterialIcons name="search" size={24} color={theme.colors.secondary1} />}
            />

            {
                data.length === 0 ?
                    <View style={{ position: "absolute", alignSelf: "center", top: "35%", justifyContent: "center" }}>
                        <ActivityIndicator size={"large"} color={theme.colors.secondary1} />
                        <Text style={[styles.title, { color: theme.colors.secondary1, textAlign: "center" }]}>
                            {`Obtendo relatórios\npróximos a você...`}
                        </Text>
                    </View>
                    : null
            }

            {
                isTabBarVisible &&
                <View style={styles.tabBar}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={[styles.title, { marginBottom: 5 }]}>
                            @{data.length > 0 && data[currentIndex].profile !== null ? data[currentIndex].profile.username : ""}
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <MaterialIcons name="chevron-left" size={28} style={{ marginRight: 10 }} color={theme.colors.text1} />
                            <MaterialIcons name="chevron-right" size={28} color={theme.colors.text1} />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <MaterialIcons name="place" size={18} color={theme.colors.text1} style={{ marginRight: 5 }} />
                        <Text style={[styles.description, { marginRight: 15 }]}>
                            {data.length > 0 ? data[currentIndex].address : ""}
                        </Text>
                    </View>
                </View>
            }

            {
                data.length > 0 &&
                <View style={styles.actionButtonsHolder}>
                    <View style={styles.actionButton}>
                        <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                        <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                        <TrashBinSVG height={28} width={28} fill={theme.colors.text1} />
                        <Text style={[styles.ratingViewerText]}>{GetRatingsAverage(data[currentIndex])}</Text>
                    </View>
                    <Pressable style={styles.actionButton} onPress={() => {
                        setCommentsModalVisible(true)
                    }}>
                        <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                        <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                        <MaterialIcons name="comment" size={28} color={theme.colors.text1} />
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={() => shareReport(setIsLoading, data[currentIndex])}>
                        <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                        <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                        <MaterialIcons name="share" size={28} color={theme.colors.text1} />
                    </Pressable>
                    <View style={styles.ratingSelector}>
                        <RatingFrame animation setRating={setRating} />
                    </View>
                </View>
            }

            {
                data.length > 0 &&
                <CommentsModal
                    isVisible={isCommentsModalVisible}
                    closeFunction={() => {
                        setCommentsModalVisible(false)
                    }}
                    report_id={data[currentIndex].id}
                />
            }
            {
                isLoading && <LoadingScreen />
            }
        </View>
    );
}