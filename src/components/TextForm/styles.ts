import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 35,
        //backgroundColor: "red",
    },
    inputContainer: {
        zIndex: 0,
        flex: 1,
        paddingLeft: 15,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        color: theme.colors.secondary1,
    },
    icon: {
        zIndex: 5,
        position: "absolute",
        top: "25%",
        left: 5,
        elevation: 10 ** 10,
    },
    title: {
        marginLeft: 11, // Epaçamento por conta das bordas arredondadas
        fontSize: 12,
        color: theme.colors.text1,
        fontFamily: theme.fonts.subtitle400
    },
});