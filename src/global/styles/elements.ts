import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const elements = StyleSheet.create({
    subContainerGreen: {
        height: 80,
        width: "90%",
        borderRadius: 15,

        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 12,

        justifyContent: "space-between",
        backgroundColor: theme.colors.secondary100,
    },
    subContainerWhite: {
        height: 200,
        width: "90%",
        borderRadius: 15,

        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 12,

        justifyContent: "space-between",
        backgroundColor: theme.colors.modalBackground,
    },
    modal: {

    }
});