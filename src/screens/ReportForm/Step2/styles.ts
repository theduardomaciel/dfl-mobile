import { StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";

export const styles = StyleSheet.create({
    cameraView: {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: "hidden"
    },
    flipCamera: {
        backgroundColor: theme.colors.primary1,
        alignItems: "center",
        justifyContent: "center",

        height: 48,
        width: 48,
        borderRadius: 10,
        position: "absolute",
        bottom: 15,
        right: 15
    },
    bottomBar: {
        alignItems: "center",
        justifyContent: "center"
    },

    // MODAL
    newPhotoButton: {
        borderRadius: 15,
        backgroundColor: theme.colors.primary1,
        width: 225,
        height: 45,

        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -15
    },

    /*     takePhotoButton: {
            width: "100%",
            height: 50,
            marginBottom: 20,
    
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            backgroundColor: theme.colors.primary1,
        } */
});