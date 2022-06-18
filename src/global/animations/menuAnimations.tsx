import { Animated } from "react-native"

const riseTrashbin = (button) => {
    Animated.spring(button, {
        toValue: 1,
        useNativeDriver: true
    }).start()
}

const downTrashbin = (button) => {
    Animated.spring(button, {
        toValue: 0,
        useNativeDriver: true
    }).start()
}

export const menuAnimations = {
    riseTrashbin,
    downTrashbin
}