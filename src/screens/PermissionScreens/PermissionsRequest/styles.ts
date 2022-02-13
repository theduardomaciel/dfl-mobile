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
        //backgroundColor: "red",
        flex: 3,
    },
    footer: {
        //backgroundColor: "blue",
        marginTop: 75,
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