import React, { useEffect, useRef, useState } from 'react';

import { ImageBackground, Text, View, } from 'react-native';

import { TextButton } from '../../components/TextButton';

import { theme } from '../../global/styles/theme';
import { styles } from './styles';
import { levelStyles } from '../Level/styles';

import { LEVELS_DATA } from '../../utils/data/levels';
import { useAuth } from '../../hooks/useAuth';

import AnimatedNumbers from 'react-native-animated-numbers';
import FocusAwareStatusBar from '../../utils/functions/FocusAwareStatusBar';

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

type Props = {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    info: string;
    icon?: string;
    gainedExperience?: number | null;
    backButtonText?: string;
    navigateTo?: string;
}

export function ConclusionScreen({ route, navigation }) {
    const { title, info, backButtonText, icon, gainedExperience, navigateTo } = route.params as Props;
    const { user } = useAuth();

    // [0] = quanto xp o usuário ganhou | [1] = porcentagem da xp que o usuário ganhou | [2] = quanto de xp ele precisa pra subir de nível
    /* const [number0, setNumber0] = useState(0); */
    //const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);

    const USER_EXP = user.profile.experience;
    const USER_LEVEL = user.profile.level
    const BAR_WIDTH = Math.floor(((USER_EXP * 100) / LEVELS_DATA[USER_LEVEL + 1].exp))

    const barWidth = useSharedValue(0)

    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: withTiming(`${barWidth.value}%`, { duration: 1500 }),
        };
    });

    const [animationConcluded, setAnimationConcluded] = useState(false)
    useEffect(() => {
        barWidth.value = BAR_WIDTH
        setTimeout(() => {
            setNumber2(LEVELS_DATA[USER_LEVEL + 1].exp - USER_EXP)
            setTimeout(() => {
                setAnimationConcluded(true)
            }, 1000);
        }, 1000);
    }, [])

    console.log(gainedExperience, typeof gainedExperience, navigateTo)
    /* Nunca deixar uma string dessa maneira: "", sem espaços, pois o react native acusa o erro de string fora de Text element */
    const experienceUI = <View>
        <View style={styles.animatedTextView}>
            <Text style={levelStyles.levelDescription}>{`Você ganhou ${gainedExperience}`}</Text>
            {/* <AnimatedNumbers
                animateToNumber={number0}
                fontStyle={levelStyles.levelDescription}
            /> */}
            <Text style={levelStyles.levelDescription}>XP! </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 5, marginTop: 5, alignItems: "center", justifyContent: "center" }}>
            <View style={levelStyles.progressBar}>
                <Animated.View style={[levelStyles.progressBar, animatedStyles, { backgroundColor: theme.colors.primary2 }]} />
            </View>
            <View style={[styles.animatedTextView, { marginLeft: 5 }]}>
                {/* <AnimatedNumbers
                    animateToNumber={number1}
                    fontStyle={levelStyles.levelDescription2}
                /> */}
                <Text style={levelStyles.levelDescription2}>{`${BAR_WIDTH}%`}</Text>
            </View>
        </View>

        <View style={styles.animatedTextView}>
            <Text style={levelStyles.levelDescription2}>{`Faltam mais `}</Text>
            <AnimatedNumbers
                animateToNumber={number2}
                fontStyle={levelStyles.levelDescription}
            />
            <Text style={levelStyles.levelDescription2}>xp para subir de nível!</Text>
        </View>
    </View>

    return (
        <ImageBackground progressiveRenderingEnabled source={require("../../assets/placeholders/background_placeholder.png")} style={styles.container}>
            <FocusAwareStatusBar backgroundColor={"transparent"} barStyle={"dark-content"} translucent={true} />
            <Text style={styles.title}>
                {title}
            </Text>
            <Text style={styles.info}>
                {info}
            </Text>
            <View style={styles.checkMarkContainer}>
                <View style={[styles.circle, { width: 175, height: 175, opacity: 0.65 }]} />
                <View style={styles.circle} />
                <Text style={{ fontSize: 64 }}>{icon ? icon : "✅"}</Text>
            </View>
            {
                gainedExperience &&
                <View style={styles.levelBackground}>
                    {experienceUI}
                </View>
            }
            {/* <Confetti colors={[theme.colors.primary1, theme.colors.secondary1, theme.colors.primary2, theme.colors.secondary2]} /> */}
            <TextButton
                title={backButtonText ? backButtonText : "Voltar para a tela inicial"}
                buttonStyle={{ backgroundColor: animationConcluded ? theme.colors.secondary1 : theme.colors.gray_light, paddingHorizontal: 20, paddingVertical: 15, marginBottom: 50 }}
                disabled={!animationConcluded}
                onPress={() => {
                    if (navigateTo) {
                        navigation.navigate(navigateTo)
                    } else {
                        navigation.navigate("Main");
                    }
                }}
            />
        </ImageBackground>
    )
}