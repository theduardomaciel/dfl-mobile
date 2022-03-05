import { Dimensions, Platform, StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

import { TAB_BAR_HEIGHT_LONG } from "../../components/TabBar";

export const styles = StyleSheet.create({
    container: {
    },
    searchBar: {
        position: "absolute",
        height: 40,
        width: "90%",
        fontSize: 12,
        alignSelf: "center",
        top: 15 + 35,
    },
    flatList: {
    },

    title: {
        color: theme.colors.text1,
        fontSize: 18,
        fontFamily: theme.fonts.title700,
    },
    description: {
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.text1,
        fontSize: 12,
    },
    infoContainer: {
        //backgroundColor: "blue",
    },

    tabBar: {
        backgroundColor: theme.colors.primary1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        width: "100%",
        height: TAB_BAR_HEIGHT_LONG + 110,
        position: "absolute",
        bottom: -175,
        zIndex: 0,
        paddingHorizontal: 20,
        paddingVertical: 10
    },

    actionButtonsHolder: {
        position: "absolute",
        right: 30,
        bottom: "17%", // Controla a distancia do bottom	
        alignItems: "center",
        justifyContent: "center"
    },
    actionButton: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 50 // Controla o espaçamento entre botões
    },
    buttonCircle: {
        position: "absolute",
        width: 65,
        height: 65,
        borderRadius: 65 / 2,
        opacity: 0.5,
        backgroundColor: theme.colors.secondary1
    }
    /* info: {
        fontFamily: theme.fonts.subtitle900,
        color: theme.colors.text1,
        fontSize: 24,
    } */
});