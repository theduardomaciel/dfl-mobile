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
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    resolvedText: {
        color: theme.colors.text1,
        fontSize: 18,
        fontFamily: theme.fonts.title500
    },
    reportInfo: {
        marginTop: 3,
        marginBottom: 15,
        color: theme.colors.primary4,
        fontSize: 10,
        fontFamily: theme.fonts.subtitle400
    },

    tagsContainer: {
        flex: 1,
    },
    tag: {
        backgroundColor: theme.colors.secondary1,
        borderRadius: 30,

        height: 40,
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginRight: 5,
        marginBottom: 5,

        alignItems: "center",
        justifyContent: "center",
        borderColor: theme.colors.primary1,
        borderWidth: 3
    },
    tagText: {
        color: theme.colors.text1,
        fontFamily: theme.fonts.subtitle500,
        fontSize: 14,

        marginRight: 5,

        textAlign: "center",
        textAlignVertical: "center"
    },

    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "center"
    },

    modal: {
        justifyContent: "space-evenly",
        minHeight: 475,
        alignItems: "center",
        height: 500,
        width: 350,
        borderRadius: 15,
        backgroundColor: theme.colors.modalBackground,
        paddingVertical: 20,
    }
});