import React, { useEffect, useRef } from 'react';

import {
    Animated,
    ImageBackground,
    Text,
    View,
} from 'react-native';
import { TextButton } from '../TextButton';

import { theme } from '../../global/styles/theme';

import { styles } from './styles';
import { levelStyles } from '../../screens/Level/styles';

import { LEVELS_DATA } from '../../utils/levels';
import { useAuth } from '../../hooks/useAuth';

import AnimatedNumbers from 'react-native-animated-numbers';
import Confetti from '../Confetti';

type Props = {
    // A ? faz com que o elemento não seja obrigatório
    title: string;
    info: string;
    icon?: string;
    gainedExperience: number | null;
    backButtonText?: string;
    onPress: () => void;
}

export function ConclusionScreen({ title, info, backButtonText, icon, gainedExperience, onPress }: Props) {
    const { user } = useAuth();

    // [0] = quanto xp o usuário ganhou | [1] = porcentagem da xp que o usuário ganhou | [2] = quanto xp ele precisa pra subir de nível
    const [number0, setNumber0] = React.useState(0);
    const [number1, setNumber1] = React.useState(0);
    const [number2, setNumber2] = React.useState(0);

    const USER_EXP = user.profile.experience;
    const USER_LEVEL = user.profile.level
    const BAR_WIDTH = ((USER_EXP * 100) / LEVELS_DATA[USER_LEVEL].exp)
    console.log("USER_EXP, USER_LEVEL, BAR_WIDTH: ", USER_EXP, USER_LEVEL, BAR_WIDTH)

    const barAnimation = useRef(new Animated.Value(0)).current;
    const barWidth = barAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", `${BAR_WIDTH}%`],
        extrapolate: 'clamp'
    });

    useEffect(() => {
        Animated.timing(barAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start();
        setTimeout(() => {
            setNumber0(gainedExperience)
        }, 150);
        setTimeout(() => {
            setNumber1(BAR_WIDTH)
        }, 1500);
        setTimeout(() => {
            setNumber2(LEVELS_DATA[USER_LEVEL + 1].exp - USER_EXP)
        }, 3000);
    }, [])

    return (
        <ImageBackground source={require("../../assets/background_placeholder.png")} style={styles.container}>
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
            <View style={styles.levelBackground}>
                <View style={styles.animatedTextView}>
                    <Text style={levelStyles.levelDescription}>
                        Você ganhou{` `}
                    </Text>
                    <AnimatedNumbers
                        animateToNumber={number0}
                        fontStyle={levelStyles.levelDescription}
                    />
                    <Text style={levelStyles.levelDescription}>
                        xp!
                    </Text>
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
                        animateToNumber={number2}
                        fontStyle={levelStyles.levelDescription}
                    />
                    <Text style={levelStyles.levelDescription2}>
                        xp para subir de nível!
                    </Text>
                </View>
            </View>
            <TextButton
                title={backButtonText ? backButtonText : "Voltar para a tela inicial"}
                buttonStyle={{ backgroundColor: theme.colors.secondary1, paddingHorizontal: 20, paddingVertical: 15, marginBottom: 50 }}
                onPress={onPress}
            />
            {/* <Confetti /> */}
        </ImageBackground>
    )
}