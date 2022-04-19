import React, { useEffect } from 'react'

import { Home } from "./Home"
import { Community } from "./Community"
import { Reports } from "./Reports"
import { Account } from "./Account"
import { ReportScreen1 } from "./ReportForm/Step1"

import { menuAnimations } from '../global/animations/menuAnimations';
import { FadeInView } from '../global/animations/fadeInView'

import { theme } from '../global/styles/theme'
import { backgroundDrivers, buttonDrivers, TabBar } from '../components/TabBar'

import { UpdateNavigationBar } from "../utils/functions/UpdateNavigationBar";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

const riseTrashbin = menuAnimations.riseTrashbin;
const downTrashbin = menuAnimations.downTrashbin;
let lastIndex = 3; // A tela inicial é a "Home", que está posicionada no index 3

const FadeHomeScreen = (props) => (
    <FadeInView>
        <Home {...props} />
    </FadeInView>
);

const FadeCommunityScreen = (props) => (
    <FadeInView>
        <Community {...props} />
    </FadeInView>
);

const FadeReportsScreen = (props) => (
    <FadeInView>
        <Reports {...props} />
    </FadeInView>
);

const FadeAccountScreen = (props) => (
    <FadeInView>
        {
            useEffect(() => {
                const changedScreen = props.navigation.addListener('focus', () => {
                    if (lastIndex !== 4) {
                        riseTrashbin(buttonDrivers[4]);
                        downTrashbin(buttonDrivers[lastIndex]);

                        if (lastIndex === 1) {
                            downTrashbin(backgroundDrivers[0]);
                        }
                        lastIndex = 4;
                    }
                });

                // Return the function to unsubscribe from the event so it gets removed on unmount
                return changedScreen;
            }, [props.navigation])
        }
        <Account {...props} />
    </FadeInView>
);

export function MainScreen() {
    return (
        <Tab.Navigator
            initialRouteName='Início'
            tabBar={props => <TabBar {...props} />}
            screenOptions={{
                headerShown: false,
                headerTransparent: true,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen
                name='Comunidade'
                component={Community}
                listeners={() => ({
                    tabPress: () => {
                        if (lastIndex !== 0) {
                            //console.log("Levantando botão de comunidade");
                            riseTrashbin(buttonDrivers[0]);
                            downTrashbin(buttonDrivers[lastIndex]);

                            if (lastIndex === 1) {
                                downTrashbin(backgroundDrivers[0]);
                            }
                            lastIndex = 0;
                        }
                    }
                })}
            />
            <Tab.Screen
                name='Relatórios'
                component={FadeReportsScreen}
                listeners={() => ({
                    tabPress: () => {
                        if (lastIndex !== 1) {
                            //console.log("Levantando botão de relatórios");
                            riseTrashbin(buttonDrivers[1]);
                            downTrashbin(buttonDrivers[lastIndex]);

                            // Subimos a barra inferior para cima na tela de relatórios
                            riseTrashbin(backgroundDrivers[0]);
                            lastIndex = 1;
                        }
                    }
                })}
            />
            <Tab.Screen
                name='Notificar Foco'
                component={ReportScreen1}
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        event.preventDefault();
                        UpdateNavigationBar(null, true, null)
                        navigation.navigate('Step1')
                    }
                })}
            />
            <Tab.Screen
                name='Início'
                component={Home}
                listeners={() => ({
                    tabPress: () => {
                        if (lastIndex !== 3) {
                            //console.log("Levantando botão de início");
                            riseTrashbin(buttonDrivers[3]);
                            downTrashbin(buttonDrivers[lastIndex]);

                            if (lastIndex === 1) {
                                downTrashbin(backgroundDrivers[0]);
                            }
                            lastIndex = 3;
                        }
                    }
                })}
            />
            <Tab.Screen
                name='Conta'
                component={FadeAccountScreen}
            />
        </Tab.Navigator>
    )
}