import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    modal: {
        justifyContent: "space-evenly",
        alignSelf: "center",
        alignItems: "center",
        height: "60%",
        width: "95%",
        borderRadius: 15,
        backgroundColor: theme.colors.modalBackground,
        paddingVertical: 20,
    },
    actionButton: {
        width: "65%",
        height: 35,
        borderRadius: 50,
        marginTop: 10,
        marginLeft: 0,
        alignItems: "center",
        backgroundColor: theme.colors.primary2,
    },
    title: {
        fontSize: 36,
        color: theme.colors.secondary1,
        fontFamily: theme.fonts.subtitle900,
        textAlign: 'center',
        marginBottom: 10
    },
    description: {
        fontSize: 14,
        fontFamily: theme.fonts.subtitle400,
        color: theme.colors.secondary1,
        textAlign: "left",
        paddingHorizontal: 10
    }
});