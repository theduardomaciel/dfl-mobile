import { Dimensions, Platform, StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";

export const styles = StyleSheet.create({
    view: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        height: "40%",
        width: "100%",
        backgroundColor: theme.colors.modalBackground,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,

        alignItems: "center",
        justifyContent: "flex-start"
    },

    title: {
        fontFamily: theme.fonts.subtitle700,
        fontSize: 14,
        color: theme.colors.secondary1,
        marginBottom: 10
    },
    usernameText: {
        fontFamily: theme.fonts.subtitle700,
        fontSize: 12,
        color: theme.colors.primary1
    },
    commentText: {
        fontFamily: theme.fonts.subtitle400,
        fontSize: 10,
        color: theme.colors.secondary1
    },
    createdAtText: {
        fontFamily: theme.fonts.subtitle400,
        fontSize: 8,
        color: theme.colors.primary1
    }
});