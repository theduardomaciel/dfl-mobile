import { StyleSheet } from "react-native";
//import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    header: {
        width: "100%",
        height: 100,
        justifyContent: "center",
    },
    headerContent: {
        marginTop: 25,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        flexDirection: "row",
    },
    headerText: {
        color: theme.colors.text1,
        fontSize: 22,
        fontFamily: theme.fonts.subtitle500
    },

    image: {
        height: 250,
        width: "100%",
        marginBottom: 15, //afastar o título por aqui mesmo
    },
    imageGradient: {
        width: "100%",
        height: "100%",
        opacity: 0.8,
        justifyContent: "flex-end",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
    },
    suggestion: {
        color: theme.colors.text1,
        fontSize: 14,
        //backgroundColor: "red",
        fontFamily: theme.fonts.subtitle400,
        width: "90%",
        marginBottom: 25,
    },

    resolvedView: {
        height: 50,
        width: "80%",
        borderRadius: 15,
        marginTop: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    resolvedText: {
        color: theme.colors.text1,
        fontSize: 18,
        fontFamily: theme.fonts.title500
    },
    reportInfo: {
        marginTop: 5,
        marginBottom: 15,
        color: theme.colors.primary4,
        fontSize: 10,
        fontFamily: theme.fonts.subtitle400
    }
});