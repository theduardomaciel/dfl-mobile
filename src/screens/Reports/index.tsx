import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StatusBar, Text, FlatList, Animated, Dimensions, Image, ViewToken, Pressable } from "react-native";
import { TextForm } from "../../components/TextForm";

import { theme } from "../../global/styles/theme";
import { styles } from "./styles";

import TrashBinSVG from "../../assets/trashbin_white.svg"

import { MaterialIcons } from "@expo/vector-icons"
import { buttonDrivers, TAB_BAR_HEIGHT, TAB_BAR_HEIGHT_LONG } from "../../components/TabBar";
import { useAuth } from "../../hooks/useAuth";

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
    useEffect(() => {
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
    }, [navigation])

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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={"black"} />
            <FlatList
                pagingEnabled
                style={styles.flatList}
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
                <Pressable style={styles.actionButton}>
                    <View style={styles.buttonCircle} />
                    <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                    <TrashBinSVG height={28} width={28} />
                </Pressable>
                <Pressable style={styles.actionButton}>
                    <View style={styles.buttonCircle} />
                    <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                    <MaterialIcons name="comment" size={28} color={theme.colors.text1} />
                </Pressable>
                <Pressable style={styles.actionButton}>
                    <View style={styles.buttonCircle} />
                    <View style={[styles.buttonCircle, { width: 50, height: 50, opacity: 1 }]} />
                    <MaterialIcons name="share" size={28} color={theme.colors.text1} />
                </Pressable>
            </View>
            {
                isTabBarVisible &&
                <View style={styles.tabBar}>
                    <Animated.View style={[styles.infoContainer, {
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