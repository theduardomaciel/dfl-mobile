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
        overflow: "hidden",
    },
    modalContainer: {
        height: "95%",
        width: "100%",
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

        alignItems: "center",
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
    closeButton: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        backgroundColor: theme.colors.text1,

        alignItems: "center",
        justifyContent: "center",

        position: "absolute",
        top: -25,
    },
    closeButtonText: {
        color: theme.colors.primary4,
        fontFamily: theme.fonts.subtitle400,
        fontSize: 18,
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
        width: "80%",
        alignItems: "center"
    },

    //ConfigOptions
    columnContainer: {
        flexDirection: "column",
        //backgroundColor: "green"
    },
    title: {
        fontFamily: theme.fonts.title700,
        fontSize: 24,
        color: theme.colors.primary1,
        //backgroundColor: "blue"
    },
    description: {
        fontFamily: theme.fonts.title400,
        fontSize: 10,
        color: theme.colors.primary3,
    },
});