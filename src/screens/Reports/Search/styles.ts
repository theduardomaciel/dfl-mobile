import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
    },
    searchBar: {
        flex: 1,
        height: 40,
        fontSize: 12,
    },
    previewContainer: {
        marginBottom: 15,
        height: 350,
        width: "49%",
    },
    preview: {
        flex: 1,
        backgroundColor: theme.colors.primary2,
        borderRadius: 3
    },
    previewProfileImage: {
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        marginRight: 5,
        overflow: "hidden",
    },
    previewRatingView: {
        position: "absolute",
        bottom: 0,
        height: "15%",
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    previewText: {
        fontSize: 12,
        color: theme.colors.secondary1,
        fontFamily: theme.fonts.subtitle400
    },
    previewSubTitle: {
        fontSize: 14,
        color: theme.colors.primary1,
        fontFamily: theme.fonts.title500
    }
});