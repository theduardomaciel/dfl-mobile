import { StyleSheet } from "react-native";
//import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    header: {
        //backgroundColor: "green",
        width: "90%",
        alignSelf: "center",
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
        color: theme.colors.secondary1,
        fontSize: 36,
        fontFamily: theme.fonts.subtitle500,
    },
    username: {
        marginTop: -5,
        fontFamily: theme.fonts.subtitle500,
        fontSize: 16,
        color: theme.colors.secondary1,
    },

    // ScrollView
    scrollContainer: {
        alignItems: "center",
    },

    // Propriedades do Relatório
    report_container: {
        height: 100,
        backgroundColor: theme.colors.background2,
        flexDirection: "row",
        borderRadius: 5,
        marginBottom: 15,
    },
    report_info_container: {
        paddingVertical: 5,
        justifyContent: "space-around",
        paddingHorizontal: 10,
        width: "65%",
    },
    report_image: {
        width: "35%",
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    report_description: {
        //backgroundColor: "blue",
        fontFamily: theme.fonts.subtitle400,
        fontSize: 11,
        color: theme.colors.primary1,
    },
    report_data: {
        fontSize: 8,
        color: theme.colors.primary2
    }
});