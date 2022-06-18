import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

const dimensions = Dimensions.get("screen")

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        height: Dimensions.get("window").height,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        top: 35
    },
    subHeader: {
        flexDirection: "row",
        width: "90%",
        marginBottom: 5,
        justifyContent: "space-between",
        alignItems: "center"
    },
    cityContainer: {
        flexDirection: "row",
        width: "90%",
        alignItems: "center",
        marginTop: -7.5,
        marginBottom: 10
    },
    cityText: {
        fontFamily: theme.fonts.title500,
        color: theme.colors.secondary1,
        fontSize: 18,
        marginRight: 5
    },
    searchBar: {
        width: "90%",
        height: 40,
        fontSize: 12,
        alignSelf: "center",
    },
    filterContainer: {
        flexDirection: "row",
        width: "100%",
        height: 35,
        marginTop: 10,
        //backgroundColor: "red",
    },
    filterView: {
        flexDirection: "row",
        backgroundColor: theme.colors.primary1,
        marginLeft: (5 / 100) * dimensions.width,
        width: "25%",
        height: "100%",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "space-evenly",
        marginRight: 10
    },
    reloadButton: {
        width: 42,
        height: 42,
        borderRadius: 42 / 2,
        backgroundColor: theme.colors.modalBackground,
        alignItems: "center",
        justifyContent: "center"
    },

    title: {
        color: theme.colors.secondary1,
        fontSize: 36,
        fontFamily: theme.fonts.subtitle500,
    },
    subtitle: {
        fontFamily: theme.fonts.title600,
        color: theme.colors.text1,
        fontSize: 15,
    },
    info: {
        fontSize: 14,
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.text1,
    }
});