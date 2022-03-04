import { StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

import { TAB_BAR_HEIGHT } from "../../components/TabBar";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.red,
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end",
    },
    searchBar: {
        position: "absolute",
        width: "90%",
        fontSize: 12,
        top: 15 + 35
    },
    flatList: {
        flex: 1,
        backgroundColor: "purple"
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
        position: "absolute",
        bottom: TAB_BAR_HEIGHT / 3,
        left: 25,
        backgroundColor: "blue",
        zIndex: 3,
    },

    tabBar: {
        backgroundColor: theme.colors.primary1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        width: "100%",
        height: TAB_BAR_HEIGHT + 110,
        position: "absolute",
        bottom: -175,
        zIndex: 0
    }
    /* info: {
        fontFamily: theme.fonts.subtitle900,
        color: theme.colors.text1,
        fontSize: 24,
    } */
});