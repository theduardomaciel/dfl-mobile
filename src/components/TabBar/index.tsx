import React from 'react'
import { View, Animated, Pressable, Easing } from 'react-native'

import { MenuButton } from "./MenuButton/index"
import { styles } from './styles'

import community_icon from '../../assets/menu/community_icon.svg'
import home_icon from '../../assets/menu/home_icon.svg';
import account_icon from '../../assets/menu/account_icon.svg';
import reports_icon from '../../assets/menu/reports_icon.svg';
const icons = [community_icon, reports_icon, null, home_icon, account_icon];

const communityButtonDriver = new Animated.Value(0)
const reportsButtonDriver = new Animated.Value(0)
const homeButtonDriver = new Animated.Value(1)
const accountButtonDriver = new Animated.Value(0)

const backgroundPositionDriver = new Animated.Value(0)
const backgroundOpacityDriver = new Animated.Value(1)
export const buttonDrivers = [communityButtonDriver, reportsButtonDriver, null, homeButtonDriver, accountButtonDriver]
export const backgroundDrivers = [backgroundPositionDriver, backgroundOpacityDriver]

const BottomTab = ({ title, index }) => {
    const icon = index == 0 ? 'home' : 'heart';
    const isMiddleButton = index == 2;
    return (
        <MenuButton title={title} image={icons[index]} isMiddleButton={isMiddleButton} index={index} />
    )
}

export const TAB_BAR_HEIGHT_LONG = 200
export const TAB_BAR_HEIGHT = 65

export function TabBar({ state, descriptors, navigation }) {
    // Adicionamos um listener no estado do TabBar para saber quando a animação de abrir o menu está acabando
    backgroundPositionDriver.addListener((value) => {
        if (value.value === 1) {
            // Caso a animação de movimento tenha terminado, o background animado deve ser ocultado
            Animated.timing(backgroundOpacityDriver, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true
            }).start()
        } else {
            backgroundOpacityDriver.setValue(1)
        }
    })
    return (
        <>
            <Animated.View style={[styles.bottomBar, {
                width: "100%", height: TAB_BAR_HEIGHT_LONG, bottom: -TAB_BAR_HEIGHT_LONG, zIndex: 0,
                opacity: backgroundOpacityDriver.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                }),
                transform: [{
                    translateY: backgroundPositionDriver.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -TAB_BAR_HEIGHT_LONG]
                    })
                }]
            }]} />
            <Animated.View style={[styles.bottomBar, {
                borderTopLeftRadius: backgroundOpacityDriver.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15]
                }),
                borderTopRightRadius: backgroundOpacityDriver.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 15]
                }),
            }]}>
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
                            <Pressable
                                key={index}
                                onPress={onPress}
                                testID={options.tabBarTestID}
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                accessibilityRole="button"
                            >
                                <BottomTab
                                    index={index}
                                    title={route.name}
                                />
                            </Pressable>
                        </Animated.View>
                    )
                })}
            </Animated.View>
        </>
    )
}