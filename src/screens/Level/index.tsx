import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Image,
    StatusBar,
    Text,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";
import { ITEM_LENGTH, styles, CURRENT_ITEM_TRANSLATE_Y } from "./styles";

import { AntDesign, Entypo } from "@expo/vector-icons"

import { SectionTitle } from "../../components/SectionTitle";
import { TextButton } from "../../components/TextButton";

import { useAuth } from "../../hooks/auth";
import { LEVELS_DATA } from "../../utils/levels";

interface ImageCarouselItem {
    id: number;
    title: string;
    exp: number;
    icon: any;
}

export function Level({ route, navigation }) {
    const { user } = useAuth();

    const scrollX = useRef(new Animated.Value(0)).current;
    const currentIndex = useRef<number>(0);
    const flatListRef = useRef<FlatList<any>>(null);
    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(false);
    const [isPrevDisabled, setIsPrevDisabled] = useState<boolean>(false);

    useEffect(() => {
        currentIndex.current = 0;
        setIsPrevDisabled(true);
    }, [LEVELS_DATA]);

    const handleOnViewableItemsChanged = useCallback(({ viewableItems }) => {
        const itemsInView = viewableItems.filter(
            ({ item }: { item: ImageCarouselItem }) => item.icon && item.title,
        );

        if (itemsInView.length === 0) {
            return;
        }

        currentIndex.current = itemsInView[0].index;

        setIsNextDisabled(currentIndex.current === LEVELS_DATA.length);
        setIsPrevDisabled(currentIndex.current === 1);
    }, []);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 100 }).current;
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, handleOnViewableItemsChanged }])

    const handleOnPrev = () => {
        if (currentIndex.current === 1) {
            return;
        }

        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                animated: true,
                index: currentIndex.current - 1,
            });
        }
    };

    const handleOnNext = () => {
        if (currentIndex.current === LEVELS_DATA.length) {
            return;
        }

        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                animated: true,
                index: currentIndex.current + 1,
            });
        }
    };

    const getItemLayout = (_data: any, index: number) => ({
        length: ITEM_LENGTH,
        offset: ITEM_LENGTH * (index - 1),
        index,
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[theme.colors.secondary1, theme.colors.primary1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <AntDesign style={{ position: "absolute", left: 20 }} name="close" size={24} color={"#FFFFFF"} onPress={() => { navigation.goBack() }} />
                    <Text style={styles.headerText}>
                        Seu Nível
                    </Text>
                    <View />
                </View>
            </LinearGradient>
            <LinearGradient
                colors={[theme.colors.secondary1, theme.colors.primary1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.actualLevelOverview}
            >
                <Text style={styles.levelTitle}>
                    Relator Iniciante
                </Text>
                <Text style={styles.levelDescription}>
                    25xp para o próximo nível
                </Text>
                <Image source={require("../../assets/level_placeholder.png")} />
            </LinearGradient>
            <TextButton
                title="Compartilhar meu nível"
                icon={<Entypo name="share" size={24} color="white" />}
                buttonStyle={{ paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10 }}
            />
            <SectionTitle title="Níveis" hasLine />
            <View style={[elements.subContainerGreen, { flex: 1, marginBottom: 20, alignItems: "center", justifyContent: "space-around" }]}>
                <View style={styles.levelOverview}>
                    <AntDesign style={{ position: "absolute" }} name="arrowleft" size={36} color="white" onPress={handleOnPrev} />
                    <FlatList
                        data={LEVELS_DATA}
                        renderItem={({ item, index }) => {

                            const inputRange = [
                                (index - 2) * ITEM_LENGTH,
                                (index - 1) * ITEM_LENGTH,
                                index * ITEM_LENGTH,
                            ];

                            const translateY = scrollX.interpolate({
                                inputRange,
                                outputRange: [
                                    CURRENT_ITEM_TRANSLATE_Y,
                                    CURRENT_ITEM_TRANSLATE_Y * -2,
                                    CURRENT_ITEM_TRANSLATE_Y,
                                ],
                                extrapolate: 'clamp',
                            });

                            return (
                                <View style={{ width: ITEM_LENGTH, justifyContent: "space-between" }}>
                                    <Text style={styles.levelDescription}>
                                        Nível {item.id}
                                    </Text>
                                    <Text style={[styles.levelTitle, { fontSize: 36 }]}>
                                        {item.title}
                                    </Text>
                                    <Animated.View style={[
                                        {
                                            transform: [{ translateY }],
                                        },
                                        styles.itemContent,
                                    ]}>
                                        <Image source={item.icon} style={styles.itemImage} />
                                    </Animated.View>
                                </View>
                            );
                        }}
                        getItemLayout={getItemLayout}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        bounces={false}
                        decelerationRate={0}
                        renderToHardwareTextureAndroid
                        contentContainerStyle={styles.flatListContent}
                        snapToInterval={ITEM_LENGTH}
                        snapToAlignment="start"
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false },
                        )}
                        scrollEventThrottle={32}
                        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                        viewabilityConfig={viewabilityConfig}
                    />
                    <AntDesign style={{ position: "absolute" }} name="arrowright" size={36} color="white" onPress={handleOnNext} />

                    <Text style={styles.levelDescription2}>
                        115 pessoas na sua cidade estão em um nível mais alto que o seu.{`\n`}
                        <Text style={{ fontWeight: "bold" }}>Que tal reportar mais focos de lixo?</Text>
                    </Text>
                </View>
            </View>
            <View style={[elements.subContainerGreen, { height: 85, marginBottom: 25 }]}>
                <Text style={[styles.levelDescription2, { fontSize: 14 }]}>
                    Média geral de avaliação dos seus relatórios{`\n`}
                    <Text style={{ fontFamily: theme.fonts.subtitle900, fontSize: 28 }}>
                        1.832/5
                    </Text>
                </Text>
            </View>
        </View>
    );
}