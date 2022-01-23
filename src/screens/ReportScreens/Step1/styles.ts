import { StyleSheet } from "react-native";
import { theme } from "../../../global/styles/theme";
//import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export const styles = StyleSheet.create({
    mapView: {
        height: 475,
        width: "100%",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: "hidden"
    }
});