import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const elements = StyleSheet.create({
    subContainerGreen: {
        height: 80,
        width: "90%",
        borderRadius: 15,

        paddingHorizontal: 12,
        paddingVertical: 12,

        justifyContent: "space-between",
        backgroundColor: theme.colors.primary1,
    },
    mapView: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden'
    },
    subContainerWhite: {
        height: 200,
        width: "90%",
        borderRadius: 15,

        paddingHorizontal: 12,
        paddingVertical: 12,

        // ShadowPropertiesLow, infelizmente por enquanto atualizar à mão igualando ao que está no arquivo "theme.ts"
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,

        backgroundColor: theme.colors.modalBackground,
    },
    modal: {

    }
});