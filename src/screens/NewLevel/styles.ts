import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.conclusionBackground,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 15
    },
    title: {
        color: theme.colors.secondary1,
        fontSize: 48,
        fontFamily: theme.fonts.title900,
        textAlign: 'center'
    },
    info: {
        color: theme.colors.secondary1,
        fontSize: 16,
        marginBottom: 35,
        width: "75%",
        lineHeight: 22,
        fontFamily: theme.fonts.subtitle400,
        textAlign: 'center'
    },

    levelBackground: {
        width: "80%",
        borderRadius: 15,
        padding: 15,
        backgroundColor: theme.colors.primary3,
        alignItems: "center",
        marginBottom: 35
    },
    levelTitle: {
        color: theme.colors.text1,
        fontSize: 42,
        fontFamily: theme.fonts.title900,
        textAlign: 'center'
    },
    animatedTextView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }
});