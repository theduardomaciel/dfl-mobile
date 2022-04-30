import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";

const dimensions = Dimensions.get("screen")
const calloutWidth = (65 / 100) * dimensions.width
export const triangleSize = 7
export const triangleLeftBorderOffset = (10 / 100) * calloutWidth

export const paddingHorizontal = 25
export const actionButtonsMargin = 5

export const styles = StyleSheet.create({
    padding: {
        marginHorizontal: paddingHorizontal
    },
    container: {
        zIndex: 5,

        marginTop: 0,
        backgroundColor: theme.colors.modalBackground,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 12,

        elevation: 4,
    },
    handle: {
        alignSelf: 'center',
        top: 10,
        width: "25%",
        height: 3,
        borderRadius: 5,
        backgroundColor: theme.colors.light_gray2,
    },
    subContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    title: {
        fontSize: 18,
        color: theme.colors.secondary1,
        fontFamily: theme.fonts.title500
    },
    info: {
        fontSize: 16,
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.primary3
    },
    subInfo: {
        fontSize: 14,
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.primary3
    },
    subTitle: {
        fontFamily: theme.fonts.title400,
        fontSize: 14,
        color: theme.colors.secondary1
    },
    actionButton: {
        backgroundColor: theme.colors.text1,
        borderRadius: 30,
        borderColor: theme.colors.primary3,
        borderWidth: 1.5,

        height: 40,
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginRight: 7,

        alignItems: "center",
        justifyContent: "center"
    },
    actionButtonText: {
        color: theme.colors.primary3,
        fontFamily: theme.fonts.title700,
        fontSize: 16,

        textAlign: "center",
        textAlignVertical: "center"
    },
    image1: {
        width: "60%",
        height: 225,
        borderRadius: 5,
    },
    image2: {
        width: "38%",
        height: 225,
        borderRadius: 5,
    },
    sectionTitle: {
        color: theme.colors.secondary1,
        fontFamily: theme.fonts.title500,
        fontSize: 16,
        marginBottom: 15
    },

    ratingMedium: {
        color: theme.colors.secondary1,
        fontFamily: theme.fonts.title500,
        fontSize: 32,
    },
    ratingTotal: {
        color: theme.colors.primary3,
        fontFamily: theme.fonts.title500,
        fontSize: 12,
    },

    ratingsLinesContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    ratingLine: {
        flex: 1,
        width: "100%",
        backgroundColor: theme.colors.primary4,
        marginBottom: 7,
        borderRadius: 5
    },
    ratingLineFilled: {
        backgroundColor: theme.colors.primary3,
        borderRadius: 5,
        position: "absolute",
    },

    bigProfileIcon: {
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
        overflow: "hidden",
    }
});