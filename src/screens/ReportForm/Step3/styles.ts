import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";


export const styles = StyleSheet.create({
    description: {
        fontFamily: theme.fonts.section400,
        color: theme.colors.secondary1,
        fontSize: 12,
        lineHeight: 12,
        marginBottom: 5
    },
    textForm: {
        backgroundColor: theme.colors.primary2,
        borderRadius: 10,
        color: theme.colors.text1,
        fontSize: 14,
        fontFamily: theme.fonts.subtitle400,
        paddingHorizontal: 15,
        paddingVertical: 15,
        textAlignVertical: "top",
        marginBottom: 10,
        minHeight: (Dimensions.get("window").height / 100) * 12
    }
});