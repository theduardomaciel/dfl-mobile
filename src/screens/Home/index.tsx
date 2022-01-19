import React, { useState } from "react";
import { View, Text, ScrollView, Image, RefreshControl } from "react-native";

//import MapView from "react-native-maps";

import { ProfileIcon } from "../../components/ProfileIcon";
import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";
//import { useNavigation, useFocusEffect } from "@react-navigation/core";

function GetGreeting() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
        return "Bom dia,";
    } else if (hour >= 12 && hour < 18) {
        return "Boa tarde,";
    } else {
        return "Boa noite,";
    }
}

export function Home() {
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true);
        console.log("Usuário atualizou página Home.")
        setRefreshing(false);
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.greetingsView}>
                    <Text style={styles.greetingsText}>
                        {GetGreeting()}
                    </Text>
                    <Text style={styles.greetingsNameText}>
                        meninocoiso!
                    </Text>
                </View>
                <ProfileIcon uri={"https://github.com/theduardomaciel.png"} />
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={50}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* Seu nível */}
                <Text style={[styles.title, { paddingTop: 0 }]}>
                    Seu nível
                </Text>
                <View style={[elements.subContainerGreen, theme.shadowProperties]}>
                    <View>
                        <Text style={styles.subtitle}>
                            Nível Atual:
                        </Text>
                        <Text style={styles.info}>
                            Relator Experiente
                        </Text>
                    </View>
                    <Image source={require("../../assets/level_placeholder.png")} />
                </View>
                {/* Seu engajamento */}
                <Text style={styles.title}>
                    Seu engajamento
                </Text>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 100 }]}>
                    <View>
                        <Text style={styles.subtitle}>
                            Focos de lixo encontrados por você este mês:
                        </Text>
                        <Text style={[styles.info, theme.shadowProperties, { fontSize: 36, textAlign: "center" }]}>
                            6 focos de lixo
                        </Text>
                    </View>
                </View>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 125, marginTop: 17 }]}>
                    <View>
                        <Text style={styles.subtitle}>
                            Destes 6 focos,
                        </Text>
                        <Text style={[styles.info, { fontSize: 24, textAlign: "center" }]}>
                            4 já foram recolhidos pelos órgãos responsáveis
                        </Text>
                    </View>
                </View>
                <Text style={styles.title}>
                    Engajamento da Comunidade
                </Text>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 256 }]}>
                    <View>
                        <Text style={[styles.info, { fontSize: 36 }]}>
                            28 focos de lixo
                        </Text>
                        <Text style={styles.subtitle}>
                            foram encontrados em seu bairro este mês
                        </Text>
                    </View>
                    {/* <MapView>

                    </MapView> */}
                </View>
                <View style={{ height: 15 }} />
            </ScrollView>
        </View>
    );
}