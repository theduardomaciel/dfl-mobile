import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    FlatList,
    Image,
    LayoutAnimation,
    Platform,
    Pressable,
    Share,
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

import { useAuth } from "../../hooks/auth";
import { LEVELS_DATA } from "../../utils/levels";

const onShare = async () => {
    try {
        const result = await Share.share({
            message:
                'DFL - Detector de Focos de Lixo',
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        Alert.alert(error.message);
    }
};

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

export function Level({ route, navigation }) {
    const { user } = useAuth();

    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList<any>>(null);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = (index: number) => {
        if (flatListRef.current !== null) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            flatListRef.current.scrollToIndex({ index: index })
        }
    };

    // Utilizamos o "callback" para que o valor do "state" seja atualizado apenas quando o usuário clicar no botão
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        return setCurrentIndex(viewableItems[0].index)
    }, []);

    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const handleOnPrev = () => {
        console.log(currentIndex)
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

    const USER_EXP = 12;
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
                    Relator Iniciante
                </Text>
                <Text style={levelStyles.levelDescription}>
                    25xp para o próximo nível
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
                            Nível {LEVELS_DATA[currentIndex + 1].id}
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
                        bounces={false}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ width: ITEM_LENGTH, marginHorizontal: SPACING * 1.5, justifyContent: "space-between" }}>
                                    {/* <View>
                                        <Text style={levelStyles.levelDescription} >
                                            Nível {item.id}
                                        </Text>
                                        <Text style={[levelStyles.levelTitle, { fontSize: 32 }]} ellipsizeMode={"middle"} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                    </View> */}
                                    <Image source={item.icon} style={levelStyles.itemImage} />
                                    <Text style={[levelStyles.levelDescription2, { marginBottom: 20 }]}>
                                        {`faltam ${item.exp - USER_EXP}xp para esse nível`}
                                    </Text>
                                </View>
                            )
                        }}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={32}
                        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                        viewabilityConfig={viewabilityConfig}
                        ref={flatListRef}
                    />
                    <AntDesign style={{ position: "absolute", top: "35%", left: 0 }} name="arrowleft" size={36} color="white" onPress={handleOnPrev} />
                    <AntDesign style={{ position: "absolute", top: "35%", right: 0 }} name="arrowright" size={36} color="white" onPress={handleOnNext} />
                    <View style={{ flexDirection: "row", marginBottom: 15, alignItems: "center", justifyContent: "center" }}>
                        <View style={levelStyles.progressBar}>
                            <View style={[levelStyles.progressBar, {
                                backgroundColor: theme.colors.primary3,
                                borderRadius: 25 / 2,
                                width: `${BAR_WIDTH > 5 ? BAR_WIDTH : 5}%`
                            }]} />
                        </View>
                        <Text style={[levelStyles.levelDescription2, { marginLeft: 3 }]}>
                            {`${BAR_WIDTH}%`}
                        </Text>
                    </View>
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
        </View>
    );
}