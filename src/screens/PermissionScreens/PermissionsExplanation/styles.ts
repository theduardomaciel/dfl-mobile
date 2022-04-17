import { StyleSheet } from "react-native";
//import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { theme } from "../../../global/styles/theme"

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
    },
    elementsContainer: {
        //backgroundColor: "green",
        paddingHorizontal: 10,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    rowContainer: {
        flex: 1,
        paddingHorizontal: 10,
        //backgroundColor: "pink",
        marginTop: 15,
        flexDirection: "row",
        maxHeight: 125,
        marginBottom: -25,
    },

    title: {
        //backgroundColor: "green",
        color: theme.colors.secondary1,
        fontSize: 34,
        lineHeight: 30,
        fontFamily: theme.fonts.subtitle500,
        paddingTop: 24,
        marginBottom: 5,
    },
    subtitle: {
        //backgroundColor: "purple",
        fontFamily: theme.fonts.title400,
        color: theme.colors.secondary1,
        fontSize: 15,
    },

    line: {
        marginTop: 5,
        marginBottom: 5,
        height: 1,
        alignSelf: "center",
        width: "95%",
        backgroundColor: theme.colors.secondary1
    },

    permissionTitle: {
        fontFamily: theme.fonts.title700,
        fontSize: 20,
        textAlignVertical: "bottom",
        color: theme.colors.secondary1
    },
    permissionDescription: {
        //backgroundColor: "red",
        fontFamily: theme.fonts.subtitle400,
        color: theme.colors.secondary1,
        fontSize: 15,
        flexWrap: "wrap"
    },
});