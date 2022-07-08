import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"

import { theme } from "../../global/styles/theme";
import { SELECTOR_WIDTH, styles } from "./styles";

import Animated, {
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { PanGestureHandler } from "react-native-gesture-handler";

import GetRatingsAverage from "../../utils/functions/GetRatingsAverage";
import { Report } from "../../@types/application";
import { shareReport } from ".";

const dimensions = Dimensions.get("screen")

type Props = {
    setRating: React.Dispatch<React.SetStateAction<number>>;
    animation?: boolean;
}

export default function RatingFrame({ setRating, animation }: Props) {

    const offset = useSharedValue(animation ? 62 : 0);
    const ratingSelectorAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: offset.value,
                },
            ],
        };
    });

    const ratingPosition = useSharedValue(animation ? 350 : 0)
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
        console.log("O gesto de avaliação iniciou.")
        animation ? offset.value = 62 : null
        ratingPosition.value = 0
    }

    const onGestureEnded = () => {
        console.log("O gesto de avaliação terminou.")
        animation ? offset.value = 62 : null
        ratingPosition.value = 350
    }

    const INITIAL_OFFSET = 15
    const POSITION_OFFSET = animation ? SELECTOR_WIDTH / 5 : (65 / 100) * dimensions.width / 5
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

    return (
        <View style={{
            flex: 1,
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
        }}>
            {
                animation ?
                    <Animated.View style={[ratingContainerAnimatedStyles, styles.ratingContainer]}>
                        <Text style={styles.ratingPlaceholder}>5</Text>
                        <Text style={styles.ratingPlaceholder}>4</Text>
                        <Text style={styles.ratingPlaceholder}>3</Text>
                        <Text style={styles.ratingPlaceholder}>2</Text>
                        <Text style={styles.ratingPlaceholder}>1</Text>
                    </Animated.View>
                    :
                    <View style={[{ width: "70%", height: "75%" }, styles.ratingContainer]}>
                        <Text style={styles.ratingPlaceholder}>5</Text>
                        <Text style={styles.ratingPlaceholder}>4</Text>
                        <Text style={styles.ratingPlaceholder}>3</Text>
                        <Text style={styles.ratingPlaceholder}>2</Text>
                        <Text style={styles.ratingPlaceholder}>1</Text>
                    </View>
            }
            <PanGestureHandler onBegan={onGestureBegin} onEnded={onGestureEnded} onCancelled={onGestureEnded} onFailed={onGestureEnded} onGestureEvent={(event) => _onPanGestureEvent(event)}>
                <Animated.View style={[styles.ratingRound, ratingSelectorAnimatedStyle]}>
                    <View style={[styles.buttonCircle, { backgroundColor: theme.colors.primary1, width: 50, height: 50, opacity: 1 }]} />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}