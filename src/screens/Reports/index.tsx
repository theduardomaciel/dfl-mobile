import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StatusBar, Text, FlatList, Dimensions, Image, ViewToken, Pressable } from "react-native";
import { TextForm } from "../../components/TextForm";

import { theme } from "../../global/styles/theme";
import { SELECTOR_WIDTH, styles } from "./styles";

import TrashBinSVG from "../../assets/trashbin_white.svg"

import { MaterialIcons } from "@expo/vector-icons"
import { buttonDrivers, TAB_BAR_HEIGHT, TAB_BAR_HEIGHT_LONG } from "../../components/TabBar";
import { useAuth } from "../../hooks/useAuth";

import Animated, {
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { PanGestureHandler } from "react-native-gesture-handler";

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

export function Reports({ route, navigation }) {
    const { user } = useAuth();

    if (user.reports === undefined) return (
        <View style={{ flex: 1 }} />
    );

    const [isTabBarVisible, setTabBarVisible] = useState(false)
    const textOpacity = useSharedValue(0)
    useEffect(() => {
        buttonDrivers[5].addListener((value) => {
            if (value.value === 1) {
                // Caso a animação de movimento tenha terminado, o background animado deve ser ocultado
                setTabBarVisible(true)
                textOpacity.value = 1
                console.log("Exibindo texto", textOpacity.value)
            }
        })
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("Des-exibindo o texto de abertura.", isTabBarVisible)
            setTabBarVisible(false)
            textOpacity.value = 0
        });
        return unsubscribe;
    }, [navigation])

    const infoStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(textOpacity.value, {
                duration: 500,
                easing: Easing.out(Easing.exp),
            })
        };
    });

    const [rating, setRating] = useState(1)

    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList<any>>(null);
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        if (viewableItems[0]) {
            setRating(1)
            return setCurrentIndex(viewableItems[0].index)
        }
    }, []);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const renderItem = ({ item, index }) => {
        const dimensions = Dimensions.get("window")
        return (
            <Image
                source={{ uri: item.image_url }}
                style={{
                    flex: 1,
                    height: dimensions.height - (TAB_BAR_HEIGHT / 2),
                }}
            />
        )
    }

    const DATA = user.reports;

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

    const ratingPosition = useSharedValue(0)
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
        console.log("Pressionando o botão")
        offset.value = 62
        ratingPosition.value = 0
    }

    const onGestureEnded = () => {
        console.log("O gesto acabou.")
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={"black"} />
            <FlatList
                pagingEnabled
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                scrollEventThrottle={50}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                viewabilityConfig={viewabilityConfig}
                ref={flatListRef}
            >

            </FlatList>
            <TextForm
                customStyle={styles.searchBar}
                textInputProps={{
                    placeholder: `Pesquisar relatos (ex.: bairro, cidade, estado)`,
                    placeholderTextColor: theme.colors.gray_light
                }}
                icon={<MaterialIcons name="search" size={24} color={theme.colors.secondary1} />}
            />

            <View style={styles.actionButtonsHolder}>
                <View style={styles.actionButton}>
                    <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                    <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                    <TrashBinSVG height={28} width={28} />
                    <Text style={[styles.ratingViewerText]}>{rating}</Text>
                </View>
                <Pressable style={styles.actionButton}>
                    <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                    <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                    <MaterialIcons name="comment" size={28} color={theme.colors.text1} />
                </Pressable>
                <Pressable style={styles.actionButton}>
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
            {
                isTabBarVisible &&
                <View style={styles.tabBar}>
                    <Animated.View style={[infoStyle]}>
                        <Text style={[styles.title, { marginBottom: 5 }]}>
                            @{user.profile.username}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <MaterialIcons name="place" size={18} color={theme.colors.text1} style={{ marginRight: 5 }} />
                            <Text style={styles.description}>
                                {user.reports[currentIndex].address}
                            </Text>
                        </View>
                    </Animated.View>
                </View>
            }
        </View>
    );
}