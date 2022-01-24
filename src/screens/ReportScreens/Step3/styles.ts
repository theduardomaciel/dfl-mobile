import { StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";
//import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export const styles = StyleSheet.create({
    description: {
        fontFamily: theme.fonts.section400,
        color: theme.colors.secondary1,
        fontSize: 12,
        lineHeight: 12
    },
    textForm: {
        height: 125,
        color: theme.colors.text1,
        fontSize: 14,
        fontFamily: theme.fonts.subtitle400
    }
});