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
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 35, //+ getStatusBarHeight(),
        marginBottom: 12,
    },
    button: {
        flexDirection: "row",
    },

    // ScrollView
    scrollContainer: {
        alignItems: "center",
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
    },

    mapView: {
        backgroundColor: theme.colors.gray_dark,
        height: 285,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
});