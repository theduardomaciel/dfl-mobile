import React from "react";
import { Animated } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { fadeAnimations } from '../animations/fadeAnimations';

export const FadeInView = (props, { navigation }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    const fadeIn = fadeAnimations.fadeIn
    const fadeOut = fadeAnimations.fadeOut

    useFocusEffect(() => {
        fadeIn(fadeAnim);
        return () => {
            fadeOut(fadeAnim);
        };
    });

    return (
        <Animated.View // Special animatable View
            needsOffscreenAlphaCompositing
            style={{
                flex: 1,
                opacity: fadeAnim, // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
};