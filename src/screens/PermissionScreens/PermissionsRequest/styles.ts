import { StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },
    list: {
    },
    footer: {
        //backgroundColor: "blue",
        //marginTop: 75
        marginTop: 35,
        paddingHorizontal: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    info: {
        fontFamily: theme.fonts.subtitle400,
        fontSize: 10,
        marginTop: 5,
        color: theme.colors.primary1,
        textAlign: "center"
    }
});