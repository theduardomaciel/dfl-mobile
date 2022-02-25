import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../global/styles/theme";

const { width } = Dimensions.get('window');

export const SPACING = 5
export const ITEM_LENGTH = width * 0.8; // Item is a square. Therefore, its height and width are of the same length.

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
        justifyContent: "center",
        flexDirection: "row",
    },
    headerText: {
        color: theme.colors.text1,
        fontSize: 22,
        alignSelf: "center",
        fontFamily: theme.fonts.subtitle500
    },

    actualLevelOverview: {
        width: "80%",
        height: 150,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginTop: 25,
        textAlign: "center",
        marginBottom: 10,
    },

    levelOverview: {

    },
    itemImage: {
        width: ITEM_LENGTH,
        //height: "50%",
        flex: 1,
        resizeMode: "contain",
        //backgroundColor: "red"
    },

    levelTitle: {
        textAlign: "center",
        fontFamily: theme.fonts.title700,
        color: theme.colors.text1,
        fontSize: 28,
    },
    levelDescription: {
        textAlign: "center",
        fontFamily: theme.fonts.title700,
        color: theme.colors.text1,
        fontSize: 12
    },

    levelDescription2: {
        textAlign: "center",
        fontFamily: theme.fonts.subtitle400,
        color: "white",
        fontSize: 12
    },

    progressBar: {
        flex: 1,
        borderRadius: 17.5,
        height: 25,
        backgroundColor: theme.colors.primary4
    }
});