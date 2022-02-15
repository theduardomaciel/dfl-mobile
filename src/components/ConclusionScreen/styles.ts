import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.conclusionBackground,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15
    },
    title: {
        color: theme.colors.secondary1,
        fontSize: 36,
        fontFamily: theme.fonts.title900,
        textAlign: 'center'
    },
    info: {
        color: theme.colors.secondary1,
        fontSize: 16,
        marginBottom: 35,
        width: "75%",
        fontFamily: theme.fonts.subtitle400,
        textAlign: 'center'
    },
    checkMarkContainer: {
        width: 250,
        height: 250,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 35
    },
    circle: {
        height: 225,
        width: 225,
        opacity: 0.55,
        backgroundColor: theme.colors.primary1,
        borderRadius: 10 ** 10,
        position: "absolute",

        alignItems: 'center',
        justifyContent: "center",
        textAlign: "center"
    }
});