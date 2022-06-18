import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        elevation: 10,
    },
    background: {
        position: "absolute",
        top: 0,
        right: 0,
        opacity: 0.5,
        backgroundColor: "black",
        ...StyleSheet.absoluteFillObject,

    },
    loadingBackground: {
        width: "25%",
        alignItems: "center",
        justifyContent: "center",
        height: 100,
        backgroundColor: theme.colors.modalBackground,
        borderRadius: 15
    }
});