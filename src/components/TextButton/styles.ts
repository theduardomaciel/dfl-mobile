import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    gradient: {
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: theme.colors.secondary1,
        alignItems: "center",
        alignSelf: 'center',
        alignContent: 'center',
        textAlignVertical: 'center',
        textAlign: 'center',
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