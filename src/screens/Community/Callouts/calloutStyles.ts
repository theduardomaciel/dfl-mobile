import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";

const dimensions = Dimensions.get("screen")
const calloutWidth = (65 / 100) * dimensions.width
export const triangleSize = 7
export const triangleLeftBorderOffset = (10 / 100) * calloutWidth

export const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderRightWidth: triangleSize / 2,
        borderBottomWidth: triangleSize,
        borderLeftWidth: triangleSize / 2,
        transform: [{ rotate: "180deg" }],
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: theme.colors.primary1,
        borderLeftColor: 'transparent',
        position: "absolute",
        bottom: -triangleSize,
        left: triangleLeftBorderOffset
    },

    calloutContainer: {
        width: calloutWidth,
        minHeight: 80,
        backgroundColor: theme.colors.modalBackground,
        borderRadius: 5,
        padding: 10
    },
    calloutSubContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    calloutTitle: {
        fontFamily: theme.fonts.title500,
        color: theme.colors.secondary1,
        fontSize: 14,
        lineHeight: 17,
        marginBottom: 5,
    },
    calloutSubtitleTrashPoint: {
        fontSize: 14,
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.primary3
    },
    calloutSubtitleEcoPoint: {
        fontSize: 12,
        fontFamily: theme.fonts.subtitle400,
        color: theme.colors.secondary1
    },
    calloutInfo: {
        fontSize: 12,
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.primary3
    },
    calloutFooter: {
        height: 3,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        width: calloutWidth,
        backgroundColor: theme.colors.primary1,
        position: "absolute",
        bottom: 0,
    }
});