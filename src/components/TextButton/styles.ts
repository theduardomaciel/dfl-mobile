import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    gradient: {
        borderRadius: 15,
        backgroundColor: theme.colors.secondary1,
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignSelf: "center",
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor: "red"
    },
    title: {
        color: theme.colors.text1,
        fontSize: 16,
        fontFamily: theme.fonts.subtitle500
    },
});