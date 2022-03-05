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
} from 'react-native-reanimated';
import { PanGestureHandler } from "react-native-gesture-handler";

const textTransparency = new Animated.Value(0);

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

export function Reports({ route, navigation }) {
    const { user } = useAuth();

    if (user.reports === undefined) return (
        <View style={{ flex: 1 }} />
    );

    const [isTabBarVisible, setTabBarVisible] = useState(false)
    /* useEffect(() => {
        buttonDrivers[5].addListener((value) => {
            if (value.value === 1) {
                // Caso a animação de movimento tenha terminado, o background animado deve ser ocultado
                setTabBarVisible(true)
                Animated.timing(textTransparency, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true
                }).start()
            }
        })
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("Des-exibindo o texto de abertura.", isTabBarVisible)
            setTabBarVisible(false)
            textTransparency.setValue(0)
        });
        return unsubscribe;
    }, [navigation]) */

    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList<any>>(null);
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        if (viewableItems[0]) {
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

    const offset = useSharedValue(0);
    const customSpringStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withSpring(offset.value, {
                        damping: 20,
                        stiffness: 90,
                    }),
                },
            ],
        };
    });

    const onRatingButtonPressIn = () => {
        console.log("Pressionando o botão")
    }

    const onRatingButtonPressOut = () => {
        console.log("Botão deixou de ser pressionado.")
        offset.value = 0
    }

    const INITIAL_OFFSET = 15
    const POSITION_OFFSET = SELECTOR_WIDTH / 5

    // Da esquerda para direita --> [0] = 5 | [1] = 4 | [2] = 3
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
        const positionFromCenter = nativeEvent.translationX // Quanta distância foi percorrida desde o início da animação
        const DISTANCE = (-POSITION_OFFSET / 2) - 15
        console.log(positionFromCenter)
        if (positionFromCenter < DISTANCE && positionFromCenter > DISTANCE * 2) {
            console.log("Dedo está no 2")
            offset.value = -POSITIONS[1] / 2 - 15
        } else if (positionFromCenter < DISTANCE * 2 && positionFromCenter > DISTANCE * 3) {
            console.log("Dedo está no 3")
            offset.value = -POSITIONS[2] + 15
        } else if (positionFromCenter < DISTANCE * 3 && positionFromCenter > DISTANCE * 4) {
            console.log("Dedo está no 4")
            offset.value = -POSITIONS[3] + 15
        } else if (positionFromCenter < DISTANCE * 4) {
            console.log("Dedo está no 5")
            offset.value = -POSITIONS[4] + 15
        } else {
            console.log("Dedo está no 1")
            offset.value = 0
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
                <View style={styles.ratingSelector}>
                    <Text style={[styles.ratingPlaceholder, { position: "absolute", left: POSITIONS[0] }]}>5</Text>
                    <Text style={[styles.ratingPlaceholder, { position: "absolute", left: POSITIONS[1] }]}>4</Text>
                    <Text style={[styles.ratingPlaceholder, { position: "absolute", left: POSITIONS[2] }]}>3</Text>
                    <Text style={[styles.ratingPlaceholder, { position: "absolute", left: POSITIONS[3] }]}>2</Text>
                    <Text style={[styles.ratingPlaceholder, { position: "absolute", left: POSITIONS[4] }]}>1</Text>
                    <PanGestureHandler onGestureEvent={_onPanGestureEvent}>
                        <Animated.View style={[styles.ratingRound, customSpringStyles]}>
                            <View style={[styles.buttonCircle, { backgroundColor: theme.colors.primary1, width: 50, height: 50, opacity: 1 }]} />
                        </Animated.View>
                    </PanGestureHandler>
                </View>
                <Pressable
                    style={styles.actionButton}
                    onLongPress={onRatingButtonPressIn}
                    onPressOut={onRatingButtonPressOut}
                >
                    <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                    <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                    <TrashBinSVG height={28} width={28} />
                </Pressable>
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
            </View>
            {
                isTabBarVisible &&
                <View style={styles.tabBar}>
                    <Animated.View style={[{
                        opacity: textTransparency.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                        }),
                    }]}>
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