import { StyleSheet } from "react-native";
//import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: "center",
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
    greetingsView: {
        justifyContent: "space-between",
        flexDirection: 'column',
        alignItems: "baseline",
    },
    greetingsText: {
        //backgroundColor: "red",
        fontFamily: theme.fonts.subtitle500,
        fontSize: 28,
        color: theme.colors.primary100,
    },
    greetingsNameText: {
        marginTop: -15,
        fontFamily: theme.fonts.subtitle500,
        fontSize: 36,
        color: theme.colors.primary100,
    },

    // ScrollView
    scrollContainer: {
        alignItems: "center",
    },

    title: {
        //backgroundColor: "green",
        flex: 1,
        marginLeft: 30,
        width: "90%", // Limita o tamanho do texto para o tamanho da tela (o título "Engajamento da Comunidade" fica cortado)
        color: theme.colors.primary100,
        fontSize: 24,
        lineHeight: 24,
        fontFamily: theme.fonts.title700,
        paddingTop: 24,
        marginBottom: 5,
    },
    subtitle: {
        //backgroundColor: "purple",
        fontFamily: theme.fonts.subtitle400,
        color: theme.colors.text1,
        fontSize: 15,
    },
    info: {
        fontFamily: theme.fonts.subtitle900,
        color: theme.colors.text1,
        fontSize: 24,
    },

    communityTitle: {
        width: "90%",
        //backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
    scopeButton: {
        height: 35,
        width: 115,
        backgroundColor: theme.colors.secondary100,
        borderRadius: 15,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "center",
    }
});