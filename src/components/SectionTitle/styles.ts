import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        //width: "100%",
        width: "90%",
        marginBottom: 15
    },
    textContainer: {
        //backgroundColor: "yellow",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        color: theme.colors.primary100,
        fontSize: 24,
        fontFamily: theme.fonts.section400
    },
    info: {
        textAlignVertical: "bottom",
        //backgroundColor: "red",
        color: theme.colors.primary100,
        fontSize: 16,
        marginBottom: 3,
        fontFamily: theme.fonts.section400
    },
    line: {
        height: 1,
        backgroundColor: theme.colors.primary100,
    }
});