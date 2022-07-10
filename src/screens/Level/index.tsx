import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    FlatList,
    Image,
    LayoutAnimation,
    Platform,
    Pressable,
    StatusBar,
    Text,
    UIManager,
    View,
    ViewToken,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";
import { ITEM_LENGTH, levelStyles, SPACING } from "./styles";

import { AntDesign, Entypo } from "@expo/vector-icons"

import { SectionTitle } from "../../components/SectionTitle";
import { TextButton } from "../../components/TextButton";

import { useAuth } from "../../hooks/useAuth";
import { LEVELS_DATA } from "../../utils/data/levels";

import * as FileSystem from 'expo-file-system';
import Share from "react-native-share";
import { LoadingScreen } from "../../components/LoadingScreen";

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

import { styles } from "../Account/styles";
import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";
import changeNavigationBarColor, { showNavigationBar } from "react-native-navigation-bar-color";

function GetReportsAmountByRating(profile) {
    const data = profile.reports;
    const amountsByRating = new Array(5).fill(0) as Array<number>;
    if (!data) return amountsByRating;
    data.forEach(report => {
        for (let index = 1; index <= 5; index++) {
            if (report["note" + index] !== 0) {
                amountsByRating[index] += report["note" + index]
            }
        }
    });
    return amountsByRating
}

function GetReportsRatingBars(profile) {
    const reportsAmountByRating = GetReportsAmountByRating(profile).slice(0, 5)
    console.log(reportsAmountByRating)

    const max = Math.max(...reportsAmountByRating);
    console.log(max)

    const TOP_DIFFERENCE = 30
    let bars = []
    for (let index = 1; index <= 5; index++) {
        const ratingAmount = reportsAmountByRating[index];
        const MAX_HEIGHT = 100 - TOP_DIFFERENCE
        const PERCENTAGE = `${Math.abs((ratingAmount * MAX_HEIGHT) / max)}%`
        const height = ratingAmount ? PERCENTAGE : "10%"
        bars.push(
            <View key={index} style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 7, color: theme.colors.primary3, fontFamily: theme.fonts.subtitle400 }}>
                    {ratingAmount ? ratingAmount : 0}
                </Text>
                <View style={{ backgroundColor: theme.colors.primary3, borderRadius: 15, height: height, width: 12 }} />
                <Text style={{ fontSize: 9, color: theme.colors.primary3, fontFamily: theme.fonts.title700 }}>
                    {`Nota ${index}`}
                </Text>
            </View>
        )
    }
    return bars
}

export function Level({ route, navigation }) {
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false)

    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList<any>>(null);

    const onShare = async () => {
        try {
            setIsLoading(true)
            FileSystem.downloadAsync(
                "https://i.imgur.com/MHBkR8n.png",
                FileSystem.documentDirectory + 'dfl_level_share_image'
            )
                .then(async ({ uri }) => {
                    console.log('Finished downloading to ', uri);
                    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
                    const base64Data = `data:image/png;base64,` + base64;
                    Share.open({
                        url: base64Data,
                        message: `Já sou um ${LEVELS_DATA[user.profile.level].title} no DFL!\nUm aplicativo para ajudar nossa cidade a ser mais limpa e livre de poluição.\nEsse é o link pra baixar: https://meninocoiso.notion.site/DFL-Detector-de-Focos-de-Lixo-83e5732ef74043a2a88bd748d6d03bd4`,
                        title: `Já sou um ${LEVELS_DATA[user.profile.level].title} no DFL!`
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
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    /* const scrollTo = (index: number) => {
        if (flatListRef.current !== null) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            flatListRef.current.scrollToIndex({ index: index })
        }
    }; */

    // Utilizamos o "callback" para que o valor do "state" seja atualizado apenas quando o usuário clicar no botão
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        if (viewableItems[0]) {
            return setCurrentIndex(viewableItems[0].index)
        }
    }, []);

    const scrollX = useRef(new Animated.Value(0)).current;
    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const handleOnPrev = () => {
        if (currentIndex === 0) {
            return;
        }
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                animated: true,
                index: currentIndex - 1,
            });
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    const handleOnNext = () => {
        // Removemos 1 por padrão, e outro pois o primeiro nível não é visualizado
        if (currentIndex === LEVELS_DATA.length - 2) {
            return;
        }
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                animated: true,
                index: currentIndex + 1,
            });
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    useEffect(() => {
        showNavigationBar();
        changeNavigationBarColor(theme.colors.background, true, true);
        if (user.profile === undefined) {
            return navigation.goBack();
        }
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, [])

    const USER_LEVEL = user.profile.level
    const USER_EXP = user.profile.experience;
    const BAR_WIDTH = ((USER_EXP * 100) / LEVELS_DATA[currentIndex + 1].exp)

    return (
        <View style={levelStyles.container}>
            <FocusAwareStatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
            <LinearGradient
                colors={[theme.colors.secondary1, theme.colors.primary1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={levelStyles.header}
            >
                <View style={levelStyles.headerContent}>
                    <AntDesign style={{ position: "absolute", left: 20 }} name="close" size={24} color={"#FFFFFF"} onPress={() => { navigation.goBack() }} />
                    <Text style={levelStyles.headerText}>
                        Seu Nível
                    </Text>
                    <View />
                </View>
            </LinearGradient>
            <LinearGradient
                colors={[theme.colors.secondary1, theme.colors.primary1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={levelStyles.actualLevelOverview}
            >
                <Text style={levelStyles.levelTitle}>
                    {LEVELS_DATA[USER_LEVEL].title}
                </Text>
                <Text style={levelStyles.levelDescription}>
                    {`${LEVELS_DATA[USER_LEVEL + 1].exp - USER_EXP}xp para o próximo nível`}
                </Text>
                <Image progressiveRenderingEnabled source={require("../../assets/placeholders/level_placeholder.png")} />
            </LinearGradient>
            <TextButton
                title="Compartilhar meu nível"
                icon={<Entypo name="share" size={24} color="white" />}
                buttonStyle={{ paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10 }}
                onPress={onShare}
            />
            <SectionTitle title="Níveis" hasLine />
            <View style={[elements.subContainerGreen, { flex: 1, marginBottom: 20, alignItems: "center", justifyContent: "space-around" }]}>
                <View style={levelStyles.levelOverview}>
                    <View>
                        <Text style={levelStyles.levelDescription} >
                            {currentIndex + 1 === USER_LEVEL ? "Nível Atual:" : `Nível ${LEVELS_DATA[currentIndex + 1].id}`}
                        </Text>
                        <Text style={[levelStyles.levelTitle, { fontSize: 32 }]} ellipsizeMode={"middle"} numberOfLines={1}>
                            {LEVELS_DATA[currentIndex + 1].title}
                        </Text>
                    </View>
                    <FlatList
                        data={LEVELS_DATA.slice(1, LEVELS_DATA.length)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        renderToHardwareTextureAndroid
                        initialScrollIndex={USER_LEVEL}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={index} style={{ width: ITEM_LENGTH, marginHorizontal: SPACING * 1.5, justifyContent: "space-between" }}>
                                    <Image progressiveRenderingEnabled source={item.icon} style={levelStyles.itemImage} />
                                    <Text style={[levelStyles.levelDescription2, { marginBottom: 20 }]}>
                                        {USER_LEVEL < item.id ? `faltam ${item.exp - USER_EXP}xp para esse nível` : `Você já passou por esse nível!`}
                                    </Text>
                                </View>
                            )
                        }}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={50}
                        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                        viewabilityConfig={viewabilityConfig}
                        ref={flatListRef}
                    />
                    <AntDesign style={{ position: "absolute", top: "35%", left: 0 }} name="arrowleft" size={36} color="white" onPress={handleOnPrev} />
                    <AntDesign style={{ position: "absolute", top: "35%", right: 0 }} name="arrowright" size={36} color="white" onPress={handleOnNext} />
                    {
                        USER_LEVEL <= LEVELS_DATA[currentIndex].id ?
                            <View style={{ flexDirection: "row", marginBottom: 15, alignItems: "center", justifyContent: "center" }}>
                                <View style={levelStyles.progressBar}>
                                    <View style={[levelStyles.progressBar, {
                                        backgroundColor: theme.colors.primary3,
                                        borderRadius: 25 / 2,
                                        width: `${BAR_WIDTH > 5 ? BAR_WIDTH : 5}%`
                                    }]} />
                                </View>
                                <Text style={[levelStyles.levelDescription2, { marginLeft: 3 }]}>
                                    {`${Math.round(BAR_WIDTH)}%`}
                                </Text>
                            </View>
                            : null
                    }

                    {/* <Text style={[levelStyles.levelDescription2, { marginBottom: 10, fontSize: 10 }]}>
                        115 pessoas na sua cidade estão em um nível mais alto que o seu.{`\n`}
                        <Text style={{ fontWeight: "bold" }}>Que tal reportar mais focos de lixo?</Text>
                    </Text> */}
                </View>
            </View>
            <View style={[elements.subContainerGreen, { minHeight: 90, marginBottom: 15, width: "75%" }]}>
                <Text style={[levelStyles.levelDescription2, { fontSize: 10, marginBottom: 5 }]}>
                    Média geral de avaliação dos seus relatórios
                </Text>
                <View style={styles.userActivityView}>
                    {GetReportsRatingBars(user.profile)}
                </View>
            </View>
            {
                isLoading ? <LoadingScreen /> : null
            }
        </View>
    );
}