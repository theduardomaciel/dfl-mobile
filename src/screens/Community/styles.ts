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
        height: 285,
        width: "90%",
        overflow: "hidden",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },

    contactView: {
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
        borderRadius: 15,

        paddingHorizontal: 12,
        paddingVertical: 12,

        width: "90%",
        flexDirection: "row",

        backgroundColor: theme.colors.modalBackground,
    },
    contactInfo: {
        fontFamily: theme.fonts.subtitle400,
        color: theme.colors.primary1,
        fontSize: 14
    }
});