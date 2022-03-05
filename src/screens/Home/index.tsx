import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, RefreshControl, Platform, Pressable, ImageBackground } from "react-native";
import { MapScopePicker } from "../../components/MapScopePicker";

import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { ProfileIcon } from "../../components/ProfileIcon";
import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

import { useAuth } from "../../hooks/useAuth";
import { ListMarkersOnMap } from "../../utils/functions/ListMarkersOnMap";
import { ModalBase } from "../../components/ModalBase";

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

type RegionType = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

const initialRegion = {
    latitude: -23.6821604,
    longitude: -46.9057052,
    latitudeDelta: 35,
    longitudeDelta: 35
}

export function Home({ route, navigation }) {
    const errorMessage = route.params?.errorMessage;
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    console.log(errorModalVisible)

    const { user, creatingAccount, updateUser } = useAuth();
    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    let mapReference: any;
    const [alreadyLoaded, setAlreadyLoaded] = useState(false)

    const [markers, setMarkers] = useState([]);
    useEffect(() => {
        setErrorModalVisible(typeof errorMessage === "string" ? true : false)
        setMarkers(ListMarkersOnMap(user, "district"))
        async function HasPermission() {
            let permissionToCheck;
            if (Platform.OS === "android") {
                permissionToCheck = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            } else if (Platform.OS === "ios") {
                permissionToCheck = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            }
            check(permissionToCheck)
                .then((result) => {
                    if (result !== RESULTS.GRANTED) {
                        creatingAccount ?
                            navigation.navigate("PermissionsExplanation")
                            : navigation.navigate("PermissionsRequest")
                    }
                });
        }
        HasPermission();
    }, []);

    const userReportsAmount = user.reports ? user.reports.length : 0
    const userReportsSolvedAmount = user.reports ? [...user.reports].filter(report => report.resolved === true).length : 0

    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = async () => {
        setIsRefreshing(true)
        await updateUser()
        setIsRefreshing(false)
        console.log("Usuário atualizou página Home.")
    }

    const [region, setRegion] = useState(initialRegion as RegionType);
    const [scopeText, setScopeText] = useState("seu bairro")
    const getScopePicked = (scope, newRegion) => {
        switch (scope) {
            case "district":
                setScopeText("em seu bairro")
                break;
            case "city":
                setScopeText("na sua cidade")
                break;
            case "state":
                setScopeText("em seu estado")
                break;
        }
        setRegion(newRegion)
    }

    return (
        <ImageBackground source={require("../../assets/background_placeholder.png")} style={styles.container}>
            <View style={styles.header}>
                <View style={styles.greetingsView}>
                    <Text style={styles.greetingsText}>
                        {GetGreeting()}
                    </Text>
                    <Text style={styles.greetingsNameText}>
                        {user.first_name + "!"}
                    </Text>
                </View>
                <ProfileIcon uri={user.image_url} />
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={50}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={-10}
                        colors={[theme.colors.primary1]}
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* Seu nível */}
                <Text style={[styles.title, { paddingTop: 0 }]}>
                    Seu nível
                </Text>
                <Pressable style={[elements.subContainerGreen, theme.shadowProperties, { flexDirection: "row" }]} onPress={() => { navigation.navigate("Level") }}>
                    <View>
                        <Text style={styles.subtitle}>
                            Nível Atual:
                        </Text>
                        <Text style={styles.info}>
                            Relator Experiente
                        </Text>
                    </View>
                    <Image source={require("../../assets/level_placeholder.png")} />
                </Pressable>

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
                            {userReportsAmount === 1 ? `1 foco de lixo` : userReportsAmount + " focos de lixo"}
                        </Text>
                    </View>
                </View>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 125, marginTop: 17 }]}>
                    <View>
                        <Text style={styles.subtitle}>
                            {userReportsAmount === 1 ? `Deste 1 foco,` : `Destes ${userReportsAmount} focos,`}
                        </Text>
                        <Text style={[styles.info, { fontSize: 24, textAlign: "center" }]}>
                            {userReportsSolvedAmount === 1 ? `1 já foi recolhido pelos órgãos responsáveis` : userReportsSolvedAmount + " já foram recolhidos pelos órgãos responsáveis"}
                        </Text>
                    </View>
                </View>

                {/* Engajamento da Comunidade */}
                <View style={styles.communityTitle}>
                    <Text style={[styles.title, { marginLeft: 12 }]}>
                        Engajamento da Comunidade
                    </Text>
                    <MapScopePicker changedScope={getScopePicked} actualRegion={region} />
                </View>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 256 }]}>
                    <Text style={[styles.info, { fontSize: 36 }]}>
                        {userReportsAmount === 1 ? `1 foco de lixo` : `${userReportsAmount} focos de lixo`}
                    </Text>
                    <Text style={styles.subtitle}>
                        {userReportsAmount === 1 ? `foi encontrado ${scopeText}` : `foram encontrados ${scopeText}`}
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
                                    setRegion(newRegion as RegionType);
                                    mapReference.animateToRegion(newRegion, 2000)
                                }
                            }}
                        >
                            {
                                markers ?
                                    markers.map((marker, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={marker.coordinates}
                                            title={marker.title}
                                            description={marker.description}
                                        />
                                    ))
                                    : null
                            }
                        </MapView>
                    </View>
                </View>
                <ModalBase
                    title="Opa! Parece que algo deu errado..."
                    description={errorMessage}
                    isVisible={errorModalVisible}
                    backButton={true}
                    toggleModal={() => setErrorModalVisible(false)}
                    onBackdropPress={() => setErrorModalVisible(false)}
                />
                <View style={{ height: 25 }} />
            </ScrollView>
        </ImageBackground>
    );
}