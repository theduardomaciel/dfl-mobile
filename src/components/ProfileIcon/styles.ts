import React from "react";
import { StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "transparent",
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    modalContainer: {
        height: "95%",
        width: "100%",
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

        justifyContent: "flex-start"
    },
    modalTitle: {
        fontFamily: theme.fonts.title700,
        color: theme.colors.text1,
        fontSize: 24
    },
    modalSubtitle: {
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.text1,
        fontSize: 12
    },
    headerGradient: {
        height: 150,
        width: "100%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

        alignItems: "center",
        justifyContent: "center"
    },
    options: {
        flex: 1,
        width: "90%"
    }
});