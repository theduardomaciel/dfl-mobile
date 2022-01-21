import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        height: 40,
        width: "90%",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: theme.colors.primary1,
        justifyContent: 'center'
    },
    info: {
        fontFamily: theme.fonts.subtitle500,
        color: theme.colors.text1,
        textAlignVertical: "center"
    }
});