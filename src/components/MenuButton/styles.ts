import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        //backgroundColor: "blue",
        height: 150,
        width: 75,
        alignItems: 'center',
        justifyContent: "flex-start",
    },
    svg: {
        resizeMode: 'contain',
        position: 'absolute',
        alignItems: 'center',
        //backgroundColor: "red",
    },
    middleButtonIcon: {
        marginTop: 35,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        flex: 1,
    },
    title: {
        marginTop: 35,
        marginBottom: 1,
        paddingHorizontal: 1,
        fontFamily: theme.fonts.subtitle500,
        fontSize: 10,
        color: theme.colors.text1,
        textAlign: 'center',
    },
});