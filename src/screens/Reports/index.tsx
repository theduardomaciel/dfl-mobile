import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StatusBar, Text, FlatList, Dimensions, Image, ViewToken, Pressable, ActivityIndicator } from "react-native";
import { TextForm } from "../../components/TextForm";

import { theme } from "../../global/styles/theme";
import { SELECTOR_WIDTH, styles } from "./styles";

import TrashBinSVG from "../../assets/trashbin_white.svg"

import { MaterialIcons } from "@expo/vector-icons"
import { backgroundDrivers, buttonDrivers, TAB_BAR_HEIGHT, TAB_BAR_HEIGHT_LONG } from "../../components/TabBar";

import { api } from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";

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

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

export function Reports({ route, navigation }) {
    const { user } = useAuth();

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    const [data, setData] = useState<Array<Report>>([])
    const [isLoadingNewData, setIsLoadingNewData] = useState(false)

    async function loadMoreReports() {
        setIsLoadingNewData(true)
        try {
            const moreReportsResponse = await api.post("/report/location", {
                location: user.profile.defaultCity ? user.profile.defaultCity.split(",")[0] : "Brasil",
                exclusion: data.map(report => report.id),
                profileToExclude: user.profile.id
            })
            const moreReports = moreReportsResponse.data as Array<Report>;
            if (data.length > 0) {
                setData(data.concat(moreReports))
            } else {
                setData(moreReports)
            }
            console.log(data.length)
        } catch (error) {
            console.log("Não foi possível conectar-se ao servidor.", error)
        }
        setIsLoadingNewData(false)
    }

    const renderFooter = ({ item, index }) => {
        return (
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

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            console.log("Ocultando tab bar")
            // Removendo a barra inferior da tela quando o usuário muda de tela
            setTabBarVisible(false)
        });
        if (data.length === 0) {
            console.log("Carregando dados...")
            loadMoreReports()
        }
        return unsubscribe;
    }, [navigation])

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

    const dimensions = Dimensions.get("window")
    const IMAGE_HEIGHT = dimensions.height - TAB_BAR_HEIGHT_LONG

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: index % 2 == 0 ? "blue" : "green", height: IMAGE_HEIGHT }}>
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

    const [isCommentsModalVisible, setCommentsModalVisible] = useState(false)
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={"black"} />
            <View
                style={{ height: IMAGE_HEIGHT, width: "100%", backgroundColor: "pink" }}
            >
                <FlatList
                    pagingEnabled
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    scrollEventThrottle={50}
                    keyExtractor={item => item.id}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    viewabilityConfig={viewabilityConfig}
                    ref={flatListRef}
                    ListFooterComponent={renderFooter}
                /* onEndReached={loadMoreReports}
                onEndReachedThreshold={0}
                 */
                />
            </View>

            <TextForm
                customStyle={styles.searchBar}
                textInputProps={{
                    placeholder: `Pesquisar relatos (ex.: bairro, cidade, estado)`,
                    placeholderTextColor: theme.colors.gray_light
                }}
                icon={<MaterialIcons name="search" size={24} color={theme.colors.secondary1} />}
            />

            {
                data.length === 0 ?
                    <View style={{ height: "100%", alignSelf: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={"large"} color={theme.colors.secondary1} />
                        <Text style={[styles.title, { width: "50%", color: theme.colors.secondary1, textAlign: "center" }]}>
                            Obtendo relatórios próximos a você
                        </Text>
                    </View>
                    : null
            }

            {
                data.length > 0 ?
                    <View style={styles.actionButtonsHolder}>
                        <View style={styles.actionButton}>
                            <View style={[styles.buttonCircle, { width: 65, height: 65 }]} />
                            <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                            <TrashBinSVG height={28} width={28} />
                            <Text style={[styles.ratingViewerText]}>{rating}</Text>
                        </View>
                        <Pressable style={styles.actionButton} onPress={() => setCommentsModalVisible(true)}>
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
                    : null
            }
            {
                isTabBarVisible &&
                <View style={styles.tabBar}>
                    <Text style={[styles.title, { marginBottom: 5 }]}>
                        @{data.length > 0 ? data[currentIndex].profile.username : "teste"}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <MaterialIcons name="place" size={18} color={theme.colors.text1} style={{ marginRight: 5 }} />
                        <Text style={styles.description}>
                            {data.length > 0 ? data[currentIndex].address : "testando"}
                        </Text>
                    </View>
                </View>
            }
            {
                data.length > 0 &&
                <CommentsModal
                    isVisible={isCommentsModalVisible}
                    closeFunction={() => { setCommentsModalVisible(false) }}
                    reportComments={data[currentIndex].comments}
                />
            }
        </View>
    );
}