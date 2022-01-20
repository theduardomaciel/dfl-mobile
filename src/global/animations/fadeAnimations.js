import { Animated, Easing } from "react-native"

const fadeIn = (fadeAnim) => {
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 75,
        easing: Easing.sin,
        useNativeDriver: true,
    }).start();
}

const fadeOut = (fadeAnim) => {
    Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 75,
        easing: Easing.sin,
        useNativeDriver: true,
    }).start();
}

export const fadeAnimations = {
    fadeIn,
    fadeOut
}