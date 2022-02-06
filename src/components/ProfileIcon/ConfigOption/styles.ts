import React from "react";
import { StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        //backgroundColor: "red",
        justifyContent: "flex-start",
        paddingLeft: 25,
        marginTop: 15,
        marginBottom: 10 //distanciar da linha
    },
    textContainer: {
        flexDirection: "column",
        marginLeft: 35,
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