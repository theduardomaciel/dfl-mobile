import { StyleSheet } from "react-native";
//import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        //backgroundColor: "green",
        width: "90%",
        alignItems: "flex-start",
        flexDirection: "column",
        justifyContent: "space-between",
        marginTop: 35, //+ getStatusBarHeight(),
        marginBottom: 25,
    },

    // ScrollView
    scrollContainer: {
        alignItems: "center",
    },

    title: {
        color: theme.colors.primary100,
        fontSize: 36,
        fontFamily: theme.fonts.subtitle500,
    },
    subtitle: {
        fontFamily: theme.fonts.section400,
        color: theme.colors.primary100,
        fontSize: 18,
    },
    info: {
        fontFamily: theme.fonts.subtitle900,
        color: theme.colors.text1,
        fontSize: 24,
    }
});