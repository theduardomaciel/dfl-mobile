import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        height: Dimensions.get("window").height,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        width: "90%",
        justifyContent: "space-between",
        position: "absolute",
        top: 35
    },
    searchBar: {
        height: 40,
        fontSize: 12,
        alignSelf: "center",
    },

    title: {
        color: theme.colors.secondary1,
        fontSize: 36,
        fontFamily: theme.fonts.subtitle500,
    },
    subtitle: {
        fontFamily: theme.fonts.subtitle400,
        color: theme.colors.text1,
        fontSize: 15,
    },
    info: {
        fontSize: 14,
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.text1,
    }
});