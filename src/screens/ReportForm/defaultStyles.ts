import { StyleSheet } from "react-native";

import { theme } from "../../global/styles/theme";

export const defaultStyles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    safeView: {
        flex: 1,
        overflow: "hidden",
        width: "90%"
    },
    header: {
        //backgroundColor: "red",
        height: 25,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 35,
        marginBottom: 5,
        //paddingHorizontal: 20
    },
    stepTitle: {
        fontSize: 16,
        fontFamily: theme.fonts.subtitle700, // o original é 700
        color: theme.colors.primary2
    },
    title: {
        color: theme.colors.secondary1,
        fontSize: 29,
        fontFamily: theme.fonts.subtitle700,
        marginBottom: 15
    },
    subtitle: {
        fontFamily: theme.fonts.subtitle700,
        color: theme.colors.secondary1,
        fontSize: 15,
    },
    info: {
        fontFamily: theme.fonts.subtitle900,
        color: theme.colors.text1,
        fontSize: 24,
    },
});