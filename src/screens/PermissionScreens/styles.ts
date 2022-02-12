import { StyleSheet } from "react-native";
//import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,

    },
    elementsContainer: {
        paddingHorizontal: 10,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    header: {
        //backgroundColor: "green",
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 35, //+ getStatusBarHeight(),
        marginBottom: 25,
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
        fontSize: 16,
    },

    line: {
        flex: 1,
        backgroundColor: theme.colors.secondary1
    },

    info: {
        fontFamily: theme.fonts.subtitle900,
        color: theme.colors.text1,
        fontSize: 24,
    },
});