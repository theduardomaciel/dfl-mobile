import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { StatusBar, TouchableOpacity, View, Text, StyleSheet, Animated, Easing } from "react-native"

import { useFocusEffect } from "@react-navigation/native";

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

import community_icon from './assets/menu/community_icon.svg';
import home_icon from './assets/menu/home_icon.svg';
import account_icon from './assets/menu/account_icon.svg';
import reports_icon from './assets/menu/reports_icon.svg';

const icons = [community_icon, reports_icon, null, home_icon, account_icon];

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

const FadeAccountScreen = (props, { navigation }) => (
    <FadeInView>
        <Account {...props} />
    </FadeInView>
);

const communityButtonDriver = new Animated.Value(0)
const reportsButtonDriver = new Animated.Value(0)
const homeButtonDriver = new Animated.Value(1)
const accountButtonDriver = new Animated.Value(0)

let lastIndex = 3;
const buttonDrivers = [communityButtonDriver, reportsButtonDriver, null, homeButtonDriver, accountButtonDriver];

function MainScreen() {
    const riseTrashbin = (button) => {
        Animated.spring(button, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start()
    }

    const downTrashbin = (button) => {
        Animated.spring(button, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start()
    }

    return (
        <Tab.Navigator
            initialRouteName='Início'
            tabBar={props => <MyTabBar {...props} />}
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
        >
            <Tab.Screen
                name='Comunidade'
                component={FadeCommunityScreen}
                listeners={() => ({
                    tabPress: () => {
                        if (lastIndex !== 0) {
                            //console.log("Levantando botão de comunidade");
                            riseTrashbin(communityButtonDriver);
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
                            riseTrashbin(reportsButtonDriver);
                            downTrashbin(buttonDrivers[lastIndex]);
                            lastIndex = 1;
                        }
                    }
                })}
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
                component={FadeHomeScreen}
                listeners={() => ({
                    tabPress: () => {
                        if (lastIndex !== 3) {
                            //console.log("Levantando botão de início");
                            riseTrashbin(homeButtonDriver);
                            downTrashbin(buttonDrivers[lastIndex]);
                            lastIndex = 3;
                        }
                    }
                })}
            />
            <Tab.Screen
                name='Conta'
                component={FadeAccountScreen}
                listeners={() => ({
                    tabPress: () => {
                        if (lastIndex !== 4) {
                            //console.log("Levantando botão de conta");
                            riseTrashbin(accountButtonDriver);
                            downTrashbin(buttonDrivers[lastIndex]);
                            lastIndex = 4;
                        }
                    }
                })}
            />
        </Tab.Navigator>
    )
}

export default function Routes() {
    return (
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
        <MenuButton title={title} image={icons[index]} isMiddleButton={isMiddleButton} index={index} />
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
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    }

                    return (
                        <Animated.View
                            key={index}
                            style={
                                index !== 2 ?
                                    {
                                        transform: [{
                                            translateY: buttonDrivers[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -12]
                                            })
                                        }]
                                    }
                                    :
                                    {}
                            }
                        >
                            <TouchableOpacity
                                key={index}
                                onPress={onPress}
                                testID={options.tabBarTestID}
                                activeOpacity={1}
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
                        </Animated.View>
                    )
                })}
            </View>
        </View>
    )
}

const FadeInView = (props, { navigation }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useFocusEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 75,
            easing: Easing.sin,
            useNativeDriver: true,
        }).start();
        return () => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 75,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();
        };
    });

    return (
        <Animated.View // Special animatable View
            needsOffscreenAlphaCompositing
            style={{
                flex: 1,
                opacity: fadeAnim, // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        height: 65,
        paddingHorizontal: 6,
        backgroundColor: theme.colors.secondary100,
        alignItems: 'center',
        flexDirection: 'row',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'space-evenly',
    },
});