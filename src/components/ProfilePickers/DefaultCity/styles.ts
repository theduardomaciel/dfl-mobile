import { StyleSheet } from 'react-native';
import { theme } from '../../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        //backgroundColor: "blue",
        marginBottom: 15
    },
    picker: {
        width: 155, fontSize: 12, color: theme.colors.secondary1, alignSelf: "center", marginLeft: 5
    }
});