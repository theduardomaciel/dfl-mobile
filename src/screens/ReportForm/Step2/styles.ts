import { StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";

export const styles = StyleSheet.create({
    cameraView: {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: "hidden"
    },
    camera: {
        flex: 1,
    },

    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    flipButton: {
        backgroundColor: theme.colors.primary1,
        alignItems: "center",
        justifyContent: "center",

        height: 48,
        width: 48,
        borderRadius: 10,
        position: "absolute",
        bottom: 5,
        right: 5
    },
    bottomBar: {
        alignItems: "center",
        justifyContent: "center"
    },

    listContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // MODAL
    footerHolder: {
        alignSelf: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "85%",
        marginTop: -55,
        //backgroundColor: "red"
    },
    buttonsHolder: {
        alignSelf: "center",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 45,
    },
    button: {
        borderRadius: 15,
        backgroundColor: theme.colors.primary1,
        flex: 0.5,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingVertical: 5,
    },
    text: {
        color: theme.colors.text1,
        fontSize: 14,
        fontFamily: theme.fonts.subtitle700
    },
    icon: {
        fontSize: 32,
        marginRight: 5,
        color: theme.colors.text1
    }
});