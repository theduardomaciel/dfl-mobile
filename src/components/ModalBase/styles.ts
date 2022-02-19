import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    modal: {
        justifyContent: "space-evenly",
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
    largeCloseButton: {
        width: "65%",
        height: 35,
        borderRadius: 50,
        backgroundColor: theme.colors.primary4,
    },
    title: {
        fontSize: 36,
        color: theme.colors.secondary1,
        fontFamily: theme.fonts.subtitle900,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        fontFamily: theme.fonts.subtitle400,
        color: theme.colors.secondary1,
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 10
    }
});