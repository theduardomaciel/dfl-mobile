import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const modalStyles = StyleSheet.create({
    modal: {
        justifyContent: "space-between",
        alignItems: "center",
        height: 250,
        width: 350,
        borderRadius: 15,
        backgroundColor: theme.colors.modalBackground,
        paddingVertical: 15,
    },
    closeButton: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
        backgroundColor: theme.colors.primary2,
        position: "absolute",
        top: -45,
        right: 5,
    },
    title: {
        fontSize: 36,
        fontFamily: theme.fonts.subtitle900,
        textAlign: 'center',
    },
});