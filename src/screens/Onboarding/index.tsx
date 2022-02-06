import React, { useRef, useState, useCallback } from "react";
import { View, FlatList, Animated, ViewToken, Pressable } from "react-native";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";

import { onboarding_screens } from "../../utils/onboarding";
import Logo from "../../assets/Logo.svg"

import { styles } from "./styles";
import { theme } from "../../global/styles/theme";

import { OnboardingItem } from "../../components/OnboardingItem";
import { Paginator } from "../../components/Paginator";

import { useAuth } from "../../hooks/auth"

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

export function Onboarding() {
    const { signIn, isSigningIn } = useAuth();

    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = (index: number) => {
        if (slidesRef.current !== null) {
            slidesRef.current.scrollToIndex({ index: index })
        }
    };

    // Utilizamos o "callback" para que o valor do "state" seja atualizado apenas quando o usuário clicar no botão
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        return setCurrentIndex(viewableItems[0].index)
    }, []);

    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

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
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    viewabilityConfig={viewabilityConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.footer}>
                <Paginator data={onboarding_screens} scrollX={scrollX} scrollTo={scrollTo} />
                <GoogleSigninButton
                    style={{ width: 270, height: 55 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={signIn}
                    disabled={isSigningIn}
                />
            </View>
        </View>
    );
}