import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Dimensions, Image, ViewToken, Pressable, ActivityIndicator } from "react-native";
import { TextForm } from "../../components/TextForm";

import { theme } from "../../global/styles/theme";
import { SELECTOR_WIDTH, styles } from "./styles";

import Toast from 'react-native-toast-message';
import Share from 'react-native-share';

import TrashBinSVG from "../../assets/trashbin_white.svg"

import { MaterialIcons } from "@expo/vector-icons"
import { backgroundDrivers, TAB_BAR_HEIGHT, TAB_BAR_HEIGHT_LONG } from "../../components/TabBar";

import { api } from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";

import * as FileSystem from 'expo-file-system';

import Animated, {
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { PanGestureHandler } from "react-native-gesture-handler";

import { CommentsModal } from "./Comments";
import { Report } from "../../@types/application";
import { LoadingScreen } from "../../components/LoadingScreen";
import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";

type PropTypes = {
    viewableItems: Array<ViewToken>;
}
import { useFocusEffect } from '@react-navigation/native';

let lastIndex = 0;

export function GetRatingsAverage(actualReport) {
    //console.log("Atualizando rating do relatório atual.")
    const ratings = [actualReport.note1, actualReport.note2, actualReport.note3, actualReport.note4, actualReport.note5]
    const sum = ratings.reduce((a, b) => a + b, 0)
    return sum / 5
}

export function Reports({ route, navigation }) {
    const { user, updateUser } = useAuth();

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<Array<Report>>([])
    async function loadMoreReports() {
        try {
            console.log(data, data.length)
            const moreReportsResponse = await api.post("/reports/search", {
                // Condição 1: Local - Caso o usuário já tenha criado um perfil, utilizamos a cidade inserida (primeiro nome antes da vírgula), 
                // caso contrário, utilizamos o Brasil inteiro como local de busca
                location: user.profile.defaultCity ? user.profile.defaultCity.split(",")[0] : "Brasil",
                // Condição 2: Novos - Excluímos os relatórios já adicionados em buscas anteriores
                exclusionsId: data.map(report => report.id),
                includeInfo: true,
                // Condição 3: Usuário - Excluímos os relatórios criados pelo próprio usuário
                //profileToExcludeId: user.profile.id
            })
            const moreReports = moreReportsResponse.data as Array<Report>;
            if (moreReports.length > 0) {
                if (data.length > 0) {
                    console.log(`➕ Adicionando novos relatórios à array de 'data'.`)
                    setData(data.concat(moreReports))
                } else {
                    console.log(`✌️ Inserindo relatórios à array de 'data' pela primeira vez.`)
                    setData(moreReports)
                }
            } else {
                showToast();
            }
        } catch (error) {
            console.log("Não foi possível conectar-se ao servidor para obter relatórios próximos ao usuário.", error)
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
        async function UpdateReportRating() {
            // Quando o usuário passar de relatório, atualizaremos a nota do anterior, caso ele tenha votado (seu rating será diferente de 0)
            if (rating !== 0) {
                const lastReport = data[lastIndex]
                const newRating = new Array(5)

                let profileRating = Object.assign(typeof user.profile.ratings === "string" ? JSON.parse(user.profile.ratings) : user.profile.ratings);

                // newRating[x] = nota | [0] = increment | [1] = decrement
                function CheckIfProfileAlreadyRated() {
                    // Loopamos entre cada uma das possíveis notas
                    for (let note = 1; note <= 5; note++) {
                        const noteRatings = profileRating[note.toString()]
                        const index = noteRatings.indexOf(lastReport.id)
                        // Caso encontremos um index diferente de -1, o usuário já votou com a "note" do loop atual
                        if (index > -1) {
                            console.log(`Usuário já avaliou esse relatório com a nota ${note}. 🚯 Removendo-a.`)
                            // Removemos 1 voto da nota em que o usuário votou
                            newRating[note] = [0, 1]
                            // Removemos a avaliação do perfil do usuário para em seguida atualizarmos ele no banco de dados
                            profileRating[note.toString()].splice(index, 1)
                            return true
                        }
                    }
                }

                const hasAlreadyVoted = CheckIfProfileAlreadyRated();

                // Deixa isso aqui depois da função que checa se o cara já votou por favor.
                profileRating[rating.toString()].push(lastReport.id)
                newRating[rating] = [1, 0]

                const serverResponse = await api.post("/report/update", {
                    report_id: lastReport.id,
                    decrement: hasAlreadyVoted ? true : false,
                    rating: newRating,
                    profile_id: user.profile.id,
                    profileRating: profileRating
                })

                const { report, profile } = serverResponse.data;

                const dataCopy = Object.assign(data)
                dataCopy[lastIndex] = report
                setData(dataCopy)

                updateUser(profile, "profile")

                lastIndex = currentIndex
                setRating(0)
            }
        }
        if (data.length > 0) {
            UpdateReportRating();
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
                <Image style={{ flex: 1, resizeMode: "cover" }} source={{ uri: item.image_url }} />
            </View>
        )
    }

    const offset = useSharedValue(62);
    const ratingSelectorAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: offset.value,
                },
            ],
        };
    });

    const ratingPosition = useSharedValue(350)
    const ratingContainerAnimatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(ratingPosition.value, {
                        duration: 500,
                        easing: Easing.out(Easing.exp),
                    }),
                },
            ],
        };
    });

    const onGestureBegin = () => {
        console.log("O gesto de avaliação iniciou.")
        offset.value = 62
        ratingPosition.value = 0
    }

    const onGestureEnded = () => {
        console.log("O gesto de avaliação terminou.")
        offset.value = 62
        ratingPosition.value = 350
    }

    const INITIAL_OFFSET = 15
    const POSITION_OFFSET = SELECTOR_WIDTH / 5
    const POSITIONS = [
        INITIAL_OFFSET,
        INITIAL_OFFSET + POSITION_OFFSET,
        INITIAL_OFFSET + POSITION_OFFSET * 2,
        INITIAL_OFFSET + POSITION_OFFSET * 3,
        INITIAL_OFFSET + POSITION_OFFSET * 4
    ]

    const _onPanGestureEvent = (event) => {
        //O único problema do uso do translationX é que caso o usuário queria trocar seu rating, a animação terá que começar do início
        const nativeEvent = event.nativeEvent;
        const POSITION_X = nativeEvent.translationX // Quanta distância foi percorrida desde o início da animação
        const DISTANCE = (-POSITION_OFFSET / 2) - 15

        const ANIMATION_CONFIG = {
            damping: 7,
            stiffness: 85,
            mass: 0.25,
        }
        if (POSITION_X < DISTANCE && POSITION_X > DISTANCE * 2) {
            //console.log("Dedo está no 2")
            offset.value = withSpring(-POSITIONS[1] / 2 - 15, ANIMATION_CONFIG)
            setRating(2)
        } else if (POSITION_X < DISTANCE * 2 && POSITION_X > DISTANCE * 3) {
            //console.log("Dedo está no 3")
            offset.value = withSpring(-POSITIONS[2] + 15, ANIMATION_CONFIG)
            setRating(3)
        } else if (POSITION_X < DISTANCE * 3 && POSITION_X > DISTANCE * 4) {
            //console.log("Dedo está no 4")
            offset.value = withSpring(-POSITIONS[3] + 15, ANIMATION_CONFIG)
            setRating(4)
        } else if (POSITION_X < DISTANCE * 4) {
            //console.log("Dedo está no 5")
            offset.value = withSpring(-POSITIONS[4] + 15, ANIMATION_CONFIG)
            setRating(5)
        } else {
            //console.log("Dedo está no 1")
            offset.value = withSpring(0, ANIMATION_CONFIG)
            setRating(1)
        }
    }

    const showToast = () => {
        console.log("Mostrando toast de aviso.")
        Toast.show({
            type: 'info',
            text1: 'Eita! Calma aí...',
            text2: 'Não há mais nenhum relatório pra carregar!',
        });
    }

    const shareReport = async () => {
        setIsLoading(true)
        const report = data[currentIndex]
        FileSystem.downloadAsync(
            report.image_url,
            FileSystem.documentDirectory + 'report_image'
        )
            .then(async ({ uri }) => {
                console.log('Finished downloading to ', uri);
                const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
                const base64Data = `data:image/png;base64,` + base64;
                Share.open({
                    url: base64Data,
                    message: `Olha esse foco de lixo que vi em *${report.address}*!\nEncontrei ele pelo aplicativo *DFL - Detector de Focos de Lixo*, que envia relatórios de focos de lixo relatados pela comunidade para a prefeitura.\n*Que tal baixar e avaliar nesse foco pra que ele seja resolvido mais rápido?*`,
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

    const [isCommentsModalVisible, setCommentsModalVisible] = useState(false)
    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" backgroundColor="#000000" />
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
                    <Text style={[styles.title, { marginBottom: 5 }]}>
                        @{data.length > 0 && data[currentIndex].profile !== null ? data[currentIndex].profile.username : "carregando..."}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <MaterialIcons name="place" size={18} color={theme.colors.text1} style={{ marginRight: 5 }} />
                        <Text style={styles.description}>
                            {data.length > 0 ? data[currentIndex].address : ""}
                        </Text>
                    </View>
                </View>
            }

            {
                data.length > 0 ?
                    <View style={styles.actionButtonsHolder}>
                        <View style={styles.actionButton}>
                            <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                            <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                            <TrashBinSVG height={28} width={28} />
                            <Text style={[styles.ratingViewerText]}>{GetRatingsAverage(data[currentIndex])}</Text>
                        </View>
                        <Pressable style={styles.actionButton} onPress={() => {

                            setCommentsModalVisible(true)
                        }}>
                            <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                            <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                            <MaterialIcons name="comment" size={28} color={theme.colors.text1} />
                        </Pressable>
                        <Pressable style={styles.actionButton} onPress={shareReport}>
                            <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                            <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                            <MaterialIcons name="share" size={28} color={theme.colors.text1} />
                        </Pressable>
                        <View style={styles.ratingSelector}>
                            <Animated.View style={[ratingContainerAnimatedStyles, styles.ratingContainer]}>
                                <Text style={styles.ratingPlaceholder}>5</Text>
                                <Text style={styles.ratingPlaceholder}>4</Text>
                                <Text style={styles.ratingPlaceholder}>3</Text>
                                <Text style={styles.ratingPlaceholder}>2</Text>
                                <Text style={styles.ratingPlaceholder}>1</Text>
                            </Animated.View>
                            <PanGestureHandler onBegan={onGestureBegin} onEnded={onGestureEnded} onGestureEvent={_onPanGestureEvent}>
                                <Animated.View style={[styles.ratingRound, ratingSelectorAnimatedStyle]}>
                                    <View style={[styles.buttonCircle, { backgroundColor: theme.colors.primary1, width: 50, height: 50, opacity: 1 }]} />
                                </Animated.View>
                            </PanGestureHandler>
                        </View>
                    </View>
                    : null
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
                isLoading ? <LoadingScreen /> : null
            }
        </View>
    );
}