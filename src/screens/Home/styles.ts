import { StyleSheet } from "react-native";

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
        marginTop: 35,
        marginBottom: 25,
    },
    greetingsView: {
        justifyContent: "space-between",
        flexDirection: 'column',
        alignItems: "baseline",
    },
    greetingsText: {
        //backgroundColor: "red",
        width: "100%",
        fontFamily: theme.fonts.subtitle500,
        fontSize: 28,
        color: theme.colors.secondary1,
    },
    greetingsNameText: {
        marginTop: -5,
        fontFamily: theme.fonts.subtitle500,
        fontSize: 36,
        color: theme.colors.secondary1,
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
        color: theme.colors.secondary1,
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
        width: "100%"
    },

    communityTitle: {
        width: "90%",
        //backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
    mapView: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden'
    }
});