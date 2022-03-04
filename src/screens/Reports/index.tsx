import React, { useEffect, useState } from "react";
import { View, StatusBar, Text, FlatList, Animated } from "react-native";
import { TextForm } from "../../components/TextForm";

import { theme } from "../../global/styles/theme";
import { styles } from "./styles";

import { MaterialIcons } from "@expo/vector-icons"
import { buttonDrivers } from "../../components/TabBar";

const textTransparency = new Animated.Value(0);

export function Reports({ route, navigation }) {
    const [isTabBarVisible, setTabBarVisible] = useState(false)
    useEffect(() => {
        buttonDrivers[5].addListener((value) => {
            if (value.value === 1) {
                // Caso a animação de movimento tenha terminado, o background animado deve ser ocultado
                setTabBarVisible(true)
                Animated.timing(textTransparency, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true
                }).start()
            }
        })
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("Des-exibindo o texto de abertura.", isTabBarVisible)
            setTabBarVisible(false)
            textTransparency.setValue(0)
        });
        return unsubscribe;
    }, [navigation])
    return (
        <View style={styles.container}>
            {
                isTabBarVisible &&
                <View style={styles.tabBar} />

            }
            <TextForm
                customStyle={styles.searchBar}
                textInputProps={{
                    placeholder: `Pesquisar relatos (ex.: bairro, cidade, estado)`,
                    placeholderTextColor: theme.colors.gray_light
                }}
                icon={<MaterialIcons name="search" size={24} color={theme.colors.secondary1} />}
            />
            {/* <FlatList style={styles.flatList}>

            </FlatList> */}
            <Text>
                teste
            </Text>
            {
                isTabBarVisible &&
                <Animated.View style={[styles.infoContainer, {
                    opacity: textTransparency.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    }),
                }]}>
                    <Text style={[styles.title, { marginBottom: 5 }]}>
                        @nomedousuário
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <MaterialIcons name="place" size={18} color={theme.colors.text1} style={{ marginRight: 5 }} />
                        <Text style={styles.description}>
                            1672 R. Al. da Paz
                        </Text>
                    </View>
                </Animated.View>

            }
        </View>
    );
}