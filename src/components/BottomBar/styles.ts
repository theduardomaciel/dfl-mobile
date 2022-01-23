import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        height: 40,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: theme.colors.primary1,
        justifyContent: 'center'
    },
    info: {
        fontSize: 12,
        fontFamily: theme.fonts.subtitle400,
        color: theme.colors.text1,
        textAlignVertical: "center"
    }
});