import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: "100%",
        height: 65,
        paddingHorizontal: 6,
        backgroundColor: theme.colors.primary1,
        alignItems: 'center',
        flexDirection: 'row',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'space-evenly',
    },
});