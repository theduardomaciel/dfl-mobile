import * as Svg from "react-native-svg";
import 'react-native-gesture-handler'

import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from "@expo-google-fonts/inter"
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black } from "@expo-google-fonts/roboto"
import { Alatsi_400Regular } from "@expo-google-fonts/alatsi"

import Routes from "./src/routes";
import { AuthProvider, useAuth } from "./src/hooks/useAuth"

import { theme } from "./src/global/styles/theme";
import { TAB_BAR_HEIGHT } from "./src/components/TabBar";

import { UpdateNavigationBar } from "./src/utils/functions/UpdateNavigationBar";

export const toastConfig = {
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
                fontSize: 14,
            }}
            text2Style={{
                fontSize: 12
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
                fontSize: 14,
            }}
            text2Style={{
                fontSize: 12
            }}
        />
    ),
    /*
      Overwrite 'info' type,
      by modifying the existing `InfoToast` component
    */
    info: (props) => (
        <InfoToast
            {...props}
            style={{ width: "95%", borderLeftColor: theme.colors.yellow }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 14,
            }}
            text2Style={{
                fontSize: 12
            }}
        />
    ),
};

export default function App() {

    const { isSigningIn } = useAuth();

    const [fontsLoaded] = Font.useFonts({
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
    if (!fontsLoaded || isSigningIn === true) {
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