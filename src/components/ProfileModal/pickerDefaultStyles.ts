import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const defaultStyles = StyleSheet.create({
    title: {
        fontFamily: theme.fonts.section400,
        color: theme.colors.secondary1,
        fontSize: 12,
        textAlign: "center"
    },
    picker: {
        justifyContent: "center",
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        height: 35,
        width: "85%"
    }
});