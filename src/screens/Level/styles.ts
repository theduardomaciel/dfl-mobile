import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../global/styles/theme";

const { width } = Dimensions.get('window');
export const ITEM_LENGTH = width * 0.8; // Item is a square. Therefore, its height and width are of the same length.

export const CURRENT_ITEM_TRANSLATE_Y = 25;
const SPACING = 5;
const BORDER_RADIUS = 20;

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

    // Carousel
    flatListContent: {
        alignItems: 'center',
    },
    item: {},
    itemContent: {
        marginHorizontal: SPACING * 3,
        alignItems: 'center',
        height: "50%"
    },
    itemImage: {
        width: '100%',
        height: ITEM_LENGTH,
        resizeMode: 'contain',
    },
    //

    levelTitle: {
        textAlign: "center",
        fontFamily: theme.fonts.title700,
        color: theme.colors.text1,
        fontSize: 28,
        backgroundColor: "green"
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