import React, { useEffect, useRef, useState } from 'react';

import {
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

import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";

import AnimatedNumbers from 'react-native-animated-numbers';
import Confetti from "../../components/Confetti/index"

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export function NewLevel({ route, navigation }) {
    const { user } = useAuth();

    const USER_LEVEL = user.profile.level
    const LEVEL_COMPONENT = LEVELS_DATA[USER_LEVEL]

    // [0] = animando número para o nível do usuário | 
    // [1] = animando a porcentagem da barra de progresso
    // [2] = decrescendo a quantidade de xp que o usuário precisa pra subir de nível

    const [number0, setNumber0] = useState(USER_LEVEL - 1);
    const [number1, setNumber1] = useState(0)
    const [number2, setNumber2] = useState(LEVEL_COMPONENT.exp)

    const barWidth = useSharedValue(0)

    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: withTiming(`${barWidth.value}%`, { duration: 2500 }),
        };
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
                    }, animatedStyles]} />
                </View>
                <View style={[styles.animatedTextView, { marginLeft: 5 }]}>
                    <AnimatedNumbers
                        animationDuration={500}
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
                    animationDuration={2150}
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
        async function Animate() {
            barWidth.value = 100
            setTimeout(() => {
                setNumber1(100)
            }, 500);
            setTimeout(() => {
                setNumber2(0)
            }, 1000);
            setTimeout(() => {
                setNumber0(USER_LEVEL)
            }, 1500);
            /* await setNumber2(0)
            await setNumber0(USER_LEVEL) */
            setTimeout(() => {
                LayoutAnimation.configureNext(LayoutAnimation.create(1000, 'easeOut', "scaleXY"));
                setIsExpandedView(true)
            }, 3500);
        }
        Animate()
    })

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    return (
        <ImageBackground source={require("../../assets/placeholders/background_placeholder.png")} style={styles.container}>
            <FocusAwareStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} translucent={true} />
            {
                isExpandedView &&
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
            }
            {
                isExpandedView ?
                    expandedView
                    : defaultView
            }
            {
                isExpandedView &&
                <Confetti colors={[theme.colors.primary1, theme.colors.secondary1, theme.colors.primary2, theme.colors.secondary2]} />
            }
            {
                isExpandedView &&
                <TextButton
                    title={"Voltar para a tela inicial"}
                    buttonStyle={{ backgroundColor: theme.colors.secondary1, paddingHorizontal: 20, paddingVertical: 15, marginBottom: 50 }}
                    onPress={() => {
                        navigation.navigate("Início")
                    }}
                />
            }
        </ImageBackground>
    )
}