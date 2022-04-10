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
    };

    useEffect(() => {
        if (user.profile === undefined) {
            return navigation.goBack();
        }
    }, [])

    const USER_LEVEL = user.profile.level
    const USER_EXP = user.profile.experience;
    const BAR_WIDTH = ((USER_EXP * 100) / LEVELS_DATA[currentIndex + 1].exp)

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    return (
        <View style={levelStyles.container}>
            <StatusBar barStyle="light-content" />
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
                <Image source={require("../../assets/level_placeholder.png")} />
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
                                    <Image source={item.icon} style={levelStyles.itemImage} />
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
            <View style={[elements.subContainerGreen, { height: 85, marginBottom: 25 }]}>
                <Text style={[levelStyles.levelDescription2, { fontSize: 14 }]}>
                    Média geral de avaliação dos seus relatórios{`\n`}
                    <Text style={{ fontFamily: theme.fonts.subtitle900, fontSize: 28 }}>
                        1.832/5
                    </Text>
                </Text>
            </View>
            {
                isLoading ? <LoadingScreen /> : null
            }
        </View>
    );
}