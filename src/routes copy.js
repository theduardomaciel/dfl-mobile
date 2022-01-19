import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar, TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Onboarding } from './screens/Onboarding';
import { PreSignUp } from './screens/PreSignUp';
import { SignUp } from './screens/SignUp';

import { Home } from "./screens/Home";
import { Community } from "./screens/Community"
import { Reports } from "./screens/Reports"
import { Account } from "./screens/Account"

import { theme } from './global/styles/theme';

import { MenuButton } from './components/MenuButton';

import group_icon from './assets/menu/group_icon.svg';
import house_icon from './assets/menu/house_icon.svg';
import person_icon from './assets/menu/person_icon_rounded.svg';
import recycling_icon from './assets/menu/recycling_icon.svg';
import { TextButton } from './components/TextButton';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Para o modal de "Notificar Foco"

function NotificarFoco({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <TextButton onPress={() => navigation.goBack()} title="Dismiss" />
        </View>
    );
}

function MainScreen() {
    return (
        <Tab.Navigator 
            screenOptions={{ 
                headerShown: false, 
                headerTransparent: true,
                tabBarStyle: {
                    backgroundColor: theme.colors.secondary100,
                    borderTopColor: theme.colors.secondary100,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    height: 55,
                },
            }}
            tabBar={props => <MyTabBar {...props} />}
        >
            <Tab.Screen 
                name='Comunidade' 
                component={Community} 
            />
            <Tab.Screen 
                name='Relatórios' 
                component={Reports} 
            />
            <Tab.Screen 
                name='Notificar Foco' 
                component={NotificarFoco} 
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        event.preventDefault();
                        navigation.navigate('NotificarFoco')
                    }
                    })}
            />
            <Tab.Screen 
                name='Início' 
                component={Home} 
            />
            <Tab.Screen 
                name='Conta' 
                component={Account}
            />
        </Tab.Navigator>
    )
}

export default function Routes() {
    return(
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* // Logged Users Screens */}
                <Stack.Screen
                    name="Main"
                    component={MainScreen}
                    options={{ headerShown: false }}
                />

                {/* // Auth Screens */}
                <Stack.Group>
                    <Stack.Screen name="Onboarding" component={Onboarding} />
                    <Stack.Screen name="PreSignUp" component={PreSignUp} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                </Stack.Group>

                {/* Modal Screens */}
                <Stack.Group screenOptions={{ presentation: 'modal' }}>
                    <Stack.Screen name="NotificarFoco" component={NotificarFoco} />
                </Stack.Group>
            </Stack.Navigator>
        </>
    )
}

const BottomTab = ({ size, title, isFocused, index }) => {
    const icon = index == 0 ? 'home' : 'heart';
    const isMiddleButton = index == 2;
    return (
        <MenuButton title={title} />
    )
}

const MyTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View>
            <View style={styles.bottomBar}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const { options } = descriptors[route.key];
            
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({name: route.name, merge: true });
                        }
                    }
                    
                    return (
                        <TouchableOpacity
                            key={index}
                            style={{ backgroundColor: "red" }}
                            onPress={onPress}
                            testID={options.tabBarTestID}
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            accessibilityRole="button"
                        >
                            <BottomTab
                                index={index}
                                title={route.name}
                                isFocused={isFocused}
                                size={24}
                            />
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 125
    },
    bottomBar: {
        height: 55,
        backgroundColor: theme.colors.secondary100,
        alignItems: 'center',
        flexDirection: 'row',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'space-around',
    },
    middleIcon: {
        bottom: 18,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        elevation: 8,
    }
});