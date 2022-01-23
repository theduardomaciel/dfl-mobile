import React, { useState } from "react";
import { View, Text, ScrollView, Image, RefreshControl, TouchableOpacity } from "react-native";
import { MapScopePicker } from "../../components/MapScopePicker";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { ProfileIcon } from "../../components/ProfileIcon";
import { TextButton } from "../../components/TextButton";
import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

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

const Marcadores = [
    {
        title: "Marcador 1",
        description: "Coiso",
        coordinates: {
            latitude: 39.09802,
            longitude: 43.14820
        }
    },
    {
        title: "Marcador 2",
        description: "Coiso 2",
        coordinates: {
            latitude: 23.52260,
            longitude: 34.16131
        }
    }
]

const initialRegion = {
    latitude: -23.6821604,
    longitude: -46.9057052,
    latitudeDelta: 35,
    longitudeDelta: 35
}

export function Home() {
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true);
        console.log("Usuário atualizou página Home.")
        setRefreshing(false);
    }

    let mapReference: any;
    const [region, setRegion] = useState(initialRegion);
    const [alreadyLoaded, setAlreadyLoaded] = useState(false)
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
                <View style={[elements.subContainerGreen, theme.shadowProperties, { flexDirection: "row" }]}>
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

                {/* Engajamento da Comunidade */}
                <View style={styles.communityTitle}>
                    <Text style={[styles.title, { marginLeft: 12 }]}>
                        Engajamento da Comunidade
                    </Text>
                    <MapScopePicker />
                </View>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 256 }]}>
                    <Text style={[styles.info, { fontSize: 36 }]}>
                        28 focos de lixo
                    </Text>
                    <Text style={styles.subtitle}>
                        foram encontrados em seu bairro este mês
                    </Text>
                    <View style={styles.mapView}>
                        <MapView
                            style={{ flex: 1, borderRadius: 10, justifyContent: "center" }}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            ref={ref => mapReference = ref}
                            showsMyLocationButton={true}
                            region={region}
                            onUserLocationChange={locationChangedResult => {
                                if (!alreadyLoaded) {
                                    setAlreadyLoaded(true)
                                    const coords = locationChangedResult.nativeEvent.coordinate
                                    const newRegion = {
                                        latitude: coords.latitude,
                                        longitude: coords.longitude,
                                        latitudeDelta: 0.05,
                                        longitudeDelta: 0.05
                                    }
                                    setRegion(newRegion);
                                    mapReference.animateToRegion(newRegion, 2000)
                                }
                            }}
                            initialRegion={initialRegion}
                        >
                            {Marcadores.map((marker, index) => (
                                <Marker
                                    key={index}
                                    coordinate={marker.coordinates}
                                    title={marker.title}
                                    description={marker.description}
                                />
                            ))}
                        </MapView>
                    </View>
                </View>
                <View style={{ height: 25 }} />
            </ScrollView>
        </View>
    );
}