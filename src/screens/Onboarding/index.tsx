import React, { useRef, useState, useCallback, useEffect } from "react";
import { View, FlatList, Animated, ViewToken } from "react-native";

import { onboarding_screens } from "../../utils/onboarding";
import Logo from "../../assets/Logo.svg"

import { styles } from "./styles";
import { theme } from "../../global/styles/theme";

import { OnboardingItem } from "../../components/OnboardingItem";
import { Paginator } from "../../components/Paginator";

import { useAuth } from "../../hooks/useAuth"

import { ModalBase } from "../../components/ModalBase";
import { TextButton } from "../../components/TextButton";

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

import Google_Logo from "../../assets/entreprises/google_logo.svg"

import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";
import { UpdateNavigationBar } from "../../utils/functions/UpdateNavigationBar";

export function Onboarding() {
    const { signIn, isSigningIn } = useAuth();

    useEffect(() => {
        UpdateNavigationBar("dark", true, theme.colors.background)
    }, [])

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

    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const errorModalInfo = [
        `Não foi possível autenticar.`,
        `Nossos servidores devem estar passando por problemas no momento :( \n Tente novamente mais tarde.`
    ]

    const loginProcess = async () => {
        const errorMessage = await signIn()
        if (errorMessage !== "cancelled" as any && errorMessage !== "success" as any) {
            setErrorModalVisible(true)
        }
    }

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
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

            <ModalBase
                title={errorModalInfo[0]}
                description={errorModalInfo[1]}
                backButton
                isVisible={errorModalVisible}
                onBackdropPress={() => setErrorModalVisible(false)}
                toggleModal={() => { setErrorModalVisible(false) }}
            />

            <View style={styles.footer}>
                <Paginator data={onboarding_screens} scrollX={scrollX} scrollTo={scrollTo} />
                <TextButton
                    title="Continuar com Google"
                    icon={<Google_Logo width={24} height={24} />}
                    iconStyle={{ marginRight: 24, }}
                    textStyle={{ color: "#444", fontSize: 16 }}
                    buttonStyle={{ paddingLeft: 16, paddingRight: 16, height: 50, backgroundColor: "#FFFFFF" }}
                    shadowType={theme.shadowPropertiesVeryLow}
                    onPress={loginProcess}
                    isLoading={isSigningIn}
                />
            </View>
        </View>
    );
}