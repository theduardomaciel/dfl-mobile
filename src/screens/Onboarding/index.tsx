import React, { useRef, useState, useCallback } from "react";
import { View, Text, FlatList, Animated, ViewToken, TouchableOpacity } from "react-native";

import { onboarding_screens } from "../../utils/onboarding";
import Logo from "../../assets/Logo.svg"

import { styles } from "./styles";
import { theme } from "../../global/styles/theme";

import { OnboardingItem } from "../../components/OnboardingItem";
import { Paginator } from "../../components/Paginator";
import { TextButton } from "../../components/TextButton";

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

export function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = (index: number) => {
        console.log("Foi")
        if (slidesRef.current !== null) {
            slidesRef.current.scrollToIndex({ index: index })
        }
    };

    // Utilizamos o "callback" para que o valor do "state" seja atualizado apenas quando o usuário clicar no botão
    const viewableItemsChanged = useCallback(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index)
    }, []);

    return (
        <View style={styles.container}>
            <Logo height={75} width={150} />
            <View style={{ flex: 0.75, marginTop: 48 }}>
                <FlatList style={styles.list}
                    data={onboarding_screens}
                    renderItem={({ item }) => <OnboardingItem image={item.icon} title={item.title} description={item.description} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={item => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.footer}>
                <Paginator data={onboarding_screens} scrollX={scrollX} scrollTo={scrollTo} />
                <TextButton
                    activeOpacity={0.9}
                    title={"Criar uma conta"}
                    buttonStyle={{ borderRadius: 8, height: 50, width: 250, backgroundColor: theme.colors.primary1 }}
                />
                <TouchableOpacity>
                    <Text style={{ color: theme.colors.primary1, fontSize: 11, marginTop: 5 }}>
                        Já tem uma conta? Faça login aqui!
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}