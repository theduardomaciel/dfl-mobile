import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    scopeButton: {
        height: 35,
        width: 125,
        backgroundColor: theme.colors.primary1,
        borderRadius: 15,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "center",
    }
});