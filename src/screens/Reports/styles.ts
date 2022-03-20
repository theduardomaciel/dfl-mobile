import { Dimensions, Platform, StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

import { TAB_BAR_HEIGHT_LONG, TOLERANCE } from "../../components/TabBar";

const dimensions = Dimensions.get("window")
export const SELECTOR_WIDTH = (dimensions.width / 100) * 55

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
    },
    searchBar: {
        position: "absolute",
        height: 40,
        width: "90%",
        fontSize: 12,
        alignSelf: "center",
        top: 15 + 35,
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
    tabBar: {
        backgroundColor: theme.colors.primary1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        width: "100%",
        height: TAB_BAR_HEIGHT_LONG,
        position: "absolute",
        bottom: -TAB_BAR_HEIGHT_LONG + TOLERANCE,
        zIndex: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    actionButtonsHolder: {
        position: "absolute",
        right: 15,
        bottom: "7%", // Controla a distancia do bottom	
        alignItems: "center",
        justifyContent: "center",
        width: 65,
        //backgroundColor: "red",
    },
    actionButton: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15, // Controla o espaçamento entre botões
        //backgroundColor: "green",
        width: 65,
        height: 65,
    },
    buttonCircle: {
        position: "absolute",
        borderRadius: 65 / 2,
        opacity: 0.5,
        backgroundColor: theme.colors.secondary1
    },
    ratingSelector: {
        position: "absolute",
        top: 15 / 2,
        right: "110%",
        width: SELECTOR_WIDTH,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
    },
    ratingContainer: {
        borderRadius: 15,
        backgroundColor: theme.colors.secondary1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15
    },
    ratingPlaceholder: {
        fontFamily: theme.fonts.title700,
        color: theme.colors.text1,
        fontSize: 24,
    },
    ratingRound: {
        position: "absolute",
        right: -10,
        alignItems: "center",
        justifyContent: "center",
        height: 65,
        width: 65,
        backgroundColor: theme.colors.primary1,
        opacity: 0.35,
        borderRadius: 65 / 2,
    },
    ratingViewerText: {
        fontSize: 12,
        fontFamily: theme.fonts.subtitle700,
        color: theme.colors.text1,
        textAlign: "center",
    }
});