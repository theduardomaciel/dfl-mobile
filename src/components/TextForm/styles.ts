import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        flex: 1,
        borderRadius: 15,
        opacity: 0.5,
        color: theme.colors.secondary1,
        //backgroundColor: "red",
        paddingHorizontal: 11,
    },
    title: {
        marginLeft: 11, // Epaçamento por conta das bordas arredondadas
        fontSize: 12,
        color: theme.colors.text1,
        fontFamily: theme.fonts.subtitle400
    },
    inputContainer: {
        height: 35,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    buttonIcon: {
        //backgroundColor: "red",
        marginLeft: 25,
        marginRight: 5,
    }
});