import { StyleSheet } from "react-native";

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
        height: "10%",
        alignSelf: "center",
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 35,
        marginBottom: 15,
    },
    userInfoContainer: {
        width: "75%",
        flexDirection: "column"
    },
    title: {
        color: theme.colors.secondary1,
        fontSize: 36,
        fontFamily: theme.fonts.subtitle500,
    },
    username: {
        marginTop: 0,
        fontFamily: theme.fonts.subtitle500,
        fontSize: 22,
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
    },

    userActivityView: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: theme.colors.primary2,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
        justifyContent: "space-between",
        alignItems: "flex-end"
    },

    statisticsTitle: {
        fontSize: 18,
        color: theme.colors.text1,
        fontFamily: theme.fonts.subtitle700
    },
    statisticsDescription: {
        fontSize: 16,
        color: theme.colors.text1,
        fontFamily: theme.fonts.subtitle400
    }
});