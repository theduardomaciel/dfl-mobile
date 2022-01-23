import { StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },
    header: {
        width: "90%",
        marginTop: 20,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 36,
        lineHeight: 35,
        fontFamily: theme.fonts.subtitle900,
        color: theme.colors.secondary1,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: theme.fonts.title400,
        color: theme.colors.secondary1,
    },
    form: {
        marginTop: 15,
        width: "90%",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    categoryTitle: {
        fontSize: 14,
        color: theme.colors.secondary1,
        fontFamily: theme.fonts.title600
    },
    section: {
        //backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 15,
    },
    passwordStrenghtText1: {
        fontFamily: theme.fonts.title700,
        fontSize: 12,
        color: theme.colors.secondary1,
        marginRight: 2,
    },
    passwordStrenghtText2: {
        fontFamily: theme.fonts.title400,
        fontSize: 12,
        color: theme.colors.secondary1
    },
    passwordStrenght: {
        width: "100%",
        height: 8,
        borderRadius: 4,
    },
});