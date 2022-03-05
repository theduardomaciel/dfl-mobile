import React, { useEffect, useRef, useState } from 'react';

import {
    Animated,
    Image,
    ImageBackground,
    LayoutAnimation,
    Platform,
    Text,
    UIManager,
    View,
} from 'react-native';
import { TextButton } from '../../components/TextButton';

import { theme } from '../../global/styles/theme';

import { styles } from './styles'
import { levelStyles } from "../Level/styles"

import { LEVELS_DATA } from '../../utils/data/levels';
import { useAuth } from '../../hooks/useAuth';

import AnimatedNumbers from 'react-native-animated-numbers';
import Confetti from "../../components/Confetti/index"

export function NewLevel({ route, navigation }) {
    const { user } = useAuth();

    const USER_LEVEL = user.profile.level
    const LEVEL_COMPONENT = LEVELS_DATA[USER_LEVEL]

    // [0] = animando número para o nível do usuário | 
    // [1] = animando a porcentagem da barra de progresso
    // [2] = descrescendo a quantidade de xp que o usuário precisa pra subir de nível

    const [number0, setNumber0] = useState(USER_LEVEL - 1);
    const [number1, setNumber1] = useState(0)
    const [number2, setNumber2] = useState(LEVEL_COMPONENT.exp)

    const barAnimation = useRef(new Animated.Value(0)).current;
    const barWidth = barAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
        extrapolate: 'clamp'
    });

    const [isExpandedView, setIsExpandedView] = useState(false)
    const defaultView =
        <View style={[styles.levelBackground]}>
            <View style={styles.animatedTextView}>
                <Text style={styles.levelTitle}>
                    Nível{` `}
                </Text>
                <AnimatedNumbers
                    animationDuration={3500}
                    animateToNumber={number0}
                    fontStyle={styles.levelTitle}
                />
            </View>
            <View style={{ flexDirection: "row", marginBottom: 5, marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                <View style={levelStyles.progressBar}>
                    <Animated.View style={[levelStyles.progressBar, {
                        backgroundColor: theme.colors.primary2,
                        borderRadius: 25 / 2,
                        width: barWidth
                    }]} />
                </View>
                <View style={[styles.animatedTextView, { marginLeft: 5 }]}>
                    <AnimatedNumbers
                        animationDuration={1500}
                        animateToNumber={number1}
                        fontStyle={levelStyles.levelDescription2}
                    />
                    <Text style={levelStyles.levelDescription2}>
                        %
                    </Text>
                </View>
            </View>

            <View style={styles.animatedTextView}>
                <Text style={levelStyles.levelDescription2}>
                    Faltam mais{` `}
                </Text>
                <AnimatedNumbers
                    animationDuration={3000}
                    animateToNumber={number2}
                    fontStyle={levelStyles.levelDescription}
                />
                <Text style={levelStyles.levelDescription2}>
                    xp para subir de nível!
                </Text>
            </View>
        </View>

    const expandedView =
        <View style={[styles.levelBackground, { height: "45%", justifyContent: "space-around" }]}>
            <Text style={[styles.levelTitle, { fontSize: 36, }]}>
                {`Nível ${USER_LEVEL}`}
            </Text>
            <Text style={[styles.levelTitle, { fontSize: 24, fontFamily: theme.fonts.title400, marginTop: -15 }]}>
                {LEVEL_COMPONENT.title}
            </Text>
            <Image style={{ flex: 1, width: "90%", resizeMode: "contain" }} source={LEVEL_COMPONENT.icon} />
            <View style={{
                backgroundColor: theme.colors.primary2,
                height: 25,
                width: "90%",
                borderRadius: 25 / 2,
            }} />
            <Text style={[styles.levelTitle, { fontSize: 18 }]}>
                100%
            </Text>
        </View>

    useEffect(() => {
        Animated.timing(barAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start();
        setTimeout(() => {
            setNumber1(100)
            setNumber2(0)
            setNumber0(USER_LEVEL)
        }, 1250);
        setTimeout(() => {
            setIsExpandedView(true)
        }, 5000);
    })

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    LayoutAnimation.configureNext(LayoutAnimation.create(500, 'easeOut', "scaleXY"));

    return (
        <ImageBackground source={require("../../assets/background_placeholder.png")} style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Text style={[styles.title, { fontSize: 24, marginTop: 100 }]}>
                    Parabéns!
                </Text>
                <Text style={styles.title}>
                    Você subiu de nível!
                </Text>
                <Text style={styles.info}>
                    Agora você é um{`\n`}
                    <Text style={{ fontFamily: theme.fonts.title700, fontSize: 24 }}>
                        {`${LEVEL_COMPONENT.title}!`}
                    </Text>
                </Text>
            </View>
            {
                isExpandedView ?
                    expandedView
                    : defaultView
            }
            <Confetti colors={[theme.colors.primary1, theme.colors.secondary1, theme.colors.primary2, theme.colors.secondary2]} />
            <TextButton
                isLoading={!isExpandedView}
                title={"Voltar para a tela inicial"}
                buttonStyle={{ backgroundColor: theme.colors.secondary1, paddingHorizontal: 20, paddingVertical: 15, marginBottom: 50 }}
                onPress={() => {
                    console.log("Foi")
                    navigation.navigate("Início")
                }}
            />
        </ImageBackground>
    )
}