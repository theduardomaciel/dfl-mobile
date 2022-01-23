import { StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },
    logo: {
        marginBottom: 127,
    },
    form: {
        width: "100%",
        height: "50%",
        backgroundColor: theme.colors.primary1,
        paddingHorizontal: 25,
        flexDirection: "column",
        justifyContent: "flex-start",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    title: {
        fontSize: 36,
        marginTop: 25,
        marginBottom: 25,
        fontFamily: theme.fonts.subtitle900,
        color: theme.colors.text1,
    },
    or: {
        height: 16,
        alignSelf: "center",
        justifyContent: "center",
        textAlignVertical: "center",
        color: theme.colors.text1,
        //backgroundColor: "blue",
        fontFamily: theme.fonts.subtitle400,
        fontSize: 12,
        marginTop: 15,
        marginBottom: 15
    },
    socialContainer: {
        //flex: 1,
        height: 42,
        //backgroundColor: "red",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
    },
});