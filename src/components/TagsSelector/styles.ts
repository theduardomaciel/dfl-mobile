import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 15
    },
    tagSection: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    tag: {
        backgroundColor: theme.colors.secondary1,
        borderRadius: 30,

        height: 40,
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginRight: 10,

        alignItems: "center",
        justifyContent: "center"
    },
    tagText: {
        color: theme.colors.text1,
        fontFamily: theme.fonts.subtitle500,
        fontSize: 14,

        marginRight: 5,

        textAlign: "center",
        textAlignVertical: "center"
    },
    selectedTags: {

    }
});