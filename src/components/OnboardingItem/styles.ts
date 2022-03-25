import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "red",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    svg: {
        resizeMode: 'contain',
        justifyContent: "center",
        alignItems: 'center',
        //backgroundColor: "blue",
    },
    title: {
        fontFamily: theme.fonts.title700,
        fontSize: 36,
        lineHeight: 35,
        letterSpacing: -1.5,
        paddingHorizontal: 15, //padrão: 10
        //letterSpacing: -1,
        //paddingHorizontaL: 0
        color: theme.colors.secondary1,
        textAlign: 'center',
        //backgroundColor: "green",
        justifyContent: 'center',
    },
    description: {
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.secondary1,
        textAlign: 'center',
        paddingHorizontal: 46,
    }
});