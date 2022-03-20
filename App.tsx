import * as Svg from "react-native-svg";
import 'react-native-gesture-handler'

import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from "@expo-google-fonts/inter"
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black } from "@expo-google-fonts/roboto"
import { Alatsi_400Regular } from "@expo-google-fonts/alatsi"

import Routes from "./src/routes";
import { AuthProvider } from "./src/hooks/useAuth"
import { theme } from "./src/global/styles/theme";
import { TAB_BAR_HEIGHT } from "./src/components/TabBar";

const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => (
        <BaseToast
            {...props}
            style={{ width: "95%", borderLeftColor: theme.colors.primary1 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
            }}
            text2Style={{
                fontSize: 13
            }}
        />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => (
        <ErrorToast
            {...props}
            style={{ width: "95%", borderLeftColor: theme.colors.red_light }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
            }}
            text2Style={{
                fontSize: 13
            }}
        />
    ),
};

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_900Black,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_900Black,
        Roboto_700Bold,
        Alatsi_400Regular
    });
    if (!fontsLoaded) {
        return <AppLoading />
    }
    return (
        <AuthProvider>
            <NavigationContainer>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="transparent"
                    translucent
                />
                <Routes />
            </NavigationContainer>
            <Toast
                config={toastConfig}
                visibilityTime={3000}
                position='bottom'
                bottomOffset={50 + TAB_BAR_HEIGHT}
            />
        </AuthProvider>
    )
}

/* <AuthProvider>
            <NavigationContainer>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="transparent"
                    translucent 
                />
                <Routes />
            </NavigationContainer>
        </AuthProvider> */