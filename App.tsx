import * as Svg from "react-native-svg";
import 'react-native-gesture-handler'

import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from "@expo-google-fonts/inter"
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black } from "@expo-google-fonts/roboto"
import { Alatsi_400Regular } from "@expo-google-fonts/alatsi"

import Routes from "./src/routes";
import { AuthProvider } from "./src/hooks/auth"

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