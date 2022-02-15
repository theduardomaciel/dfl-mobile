import React, { useEffect } from 'react'

import { Home } from "./Home"
import { Community } from "./Community"
import { Reports } from "./Reports"
import { Account } from "./Account"
import { ReportScreen1 } from "../screens/ReportScreens/Step1"

import { menuAnimations } from '../global/animations/menuAnimations';
import { FadeInView } from '../global/animations/fadeInView'

import { theme } from '../global/styles/theme'
import { buttonDrivers, TabBar } from '../components/TabBar'

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
                tabBarStyle: {
                    backgroundColor: theme.colors.primary1,
                    borderTopColor: theme.colors.primary1,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    height: 55,
                },
            }}
        >
            <Tab.Screen
                name='Comunidade'
                component={FadeCommunityScreen}
                listeners={() => ({
                    tabPress: () => {
                        if (lastIndex !== 0) {
                            //console.log("Levantando botão de comunidade");
                            riseTrashbin(buttonDrivers[0]);
                            downTrashbin(buttonDrivers[lastIndex]);
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
                        navigation.navigate('Step1')
                    }
                })}
            />
            <Tab.Screen
                name='Início'
                component={FadeHomeScreen}
                listeners={() => ({
                    tabPress: () => {
                        if (lastIndex !== 3) {
                            //console.log("Levantando botão de início");
                            riseTrashbin(buttonDrivers[3]);
                            downTrashbin(buttonDrivers[lastIndex]);
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