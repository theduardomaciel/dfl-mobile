import * as Svg from "react-native-svg";
import 'react-native-gesture-handler'
import 'expo-dev-client'

import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const fontsToLoad = {
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
}

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Host } from 'react-native-portalize';

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from "@expo-google-fonts/inter"
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black } from "@expo-google-fonts/roboto"
import { Alatsi_400Regular } from "@expo-google-fonts/alatsi"

import Routes from "./src/routes";
import { AuthProvider } from "./src/hooks/useAuth"

import { theme } from "./src/global/styles/theme";
import { TAB_BAR_HEIGHT } from "./src/components/TabBar";

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
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Pre-load fonts, make any API calls you need to do here
                await Font.loadAsync(fontsToLoad);
                // Artificially delay for two seconds to simulate a slow loading
                // experience. Please remove this if you copy and paste the code!
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    useEffect(() => {
        async function prepareApp() {
            if (appIsReady) {
                // This tells the splash screen to hide immediately! If we call this after
                // `setAppIsReady`, then we may see a blank screen while the app is
                // loading its initial state and rendering its first pixels. So instead,
                // we hide the splash screen once we know the root view has already
                // performed layout.
                await SplashScreen.hideAsync();
            }
        }
        prepareApp()
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <Host>
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
                </Host>
            </AuthProvider>
        </GestureHandlerRootView>

    )
}