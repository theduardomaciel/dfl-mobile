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
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 35, //+ getStatusBarHeight(),
        marginBottom: 25,
    },
    userInfoContainer: {
        flexDirection: "column"
    },
    title: {
        color: theme.colors.primary100,
        fontSize: 36,
        fontFamily: theme.fonts.subtitle500,
    },
    username: {
        marginTop: -5,
        fontFamily: theme.fonts.subtitle500,
        fontSize: 16,
        color: theme.colors.primary100,
    },

    // ScrollView
    scrollContainer: {
        alignItems: "center",
    },


    // Propriedades do Relatório
    report_container: {
        height: 100,
        backgroundColor: theme.colors.unselected,
        flexDirection: "row",
        borderRadius: 5,
        marginBottom: 15,
    },
    report_info_container: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: "65%",
    },
    report_image: {
        width: "35%",
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    report_description: {
        flex: 1,
        textAlignVertical: "bottom",
        justifyContent: "flex-end",
        //backgroundColor: "blue",
        fontFamily: theme.fonts.subtitle400,
        fontSize: 10,
        color: theme.colors.secondary100,
    },
});