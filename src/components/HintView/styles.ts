import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        width: "96%",
        alignSelf: "center",
        backgroundColor: theme.colors.primary4,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    text: {
        fontFamily: theme.fonts.subtitle400,
        fontSize: 15,
        color: theme.colors.primary1
    }
});