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
import { LEVELS_DATA } from "../../utils/data/levels";

import * as Location from "expo-location";
import FocusAwareStatusBar from "../../utils/FocusAwareStatusBar";

import changeNavigationBarColor, {
    hideNavigationBar,
    showNavigationBar,
} from 'react-native-navigation-bar-color';

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

    const [errorMessage, setErrorMessage] = useState(route.params?.errorMessage);
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    useEffect(() => {
        setErrorModalVisible(typeof errorMessage === "string" ? true : false)
    }, [errorMessage])

    const { user, creatingAccount, updateUser, signOut } = useAuth();

    let mapReference: any;
    const [alreadyLoaded, setAlreadyLoaded] = useState(false)

    const [markers, setMarkers] = useState([]);
    useEffect(() => {
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
        if (route.params?.errorMessage) {
            console.log("Error Message: ", route.params?.errorMessage)
            setErrorMessage(route.params?.errorMessage)
            setErrorModalVisible(true)
        }
        changeNavigationBarColor("black", false, true);
        hideNavigationBar()
    }, []);

    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = async () => {
        setIsRefreshing(true)
        await updateUser()
        setIsRefreshing(false)
        console.log("Usuário atualizou página Home.")
    }

    const [region, setRegion] = useState(initialRegion as RegionType);
    const [scopeText, setScopeText] = useState("em seu bairro")
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

    const [isAvailable, setIsAvailable] = useState(true)
    async function CheckAvailability(coords) {
        const userLocation = await Location.reverseGeocodeAsync(coords) as any;
        if (userLocation.city && userLocation.subRegion !== "Maceió") {
            console.log("Usuário não está em um local permitido.")
            setIsAvailable(false)
            setErrorMessage("Por enquanto, o DFL não está disponível em sua localização :(\nAguarde o lançamento oficial do aplicativo para que sua região esteja disponível.")
            setErrorModalVisible(true)
        }
    }

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    const userReports = user.profile.reports ? user.profile.reports : []
    const userReportsInMonthAmount = [...userReports].filter(report => new Date(report.createdAt).getMonth() === new Date().getMonth()).length
    const userReportsSolvedInMonthAmount = [...userReports].filter(report => new Date(report.createdAt).getMonth() === new Date().getMonth() && report.resolved === true).length

    return (
        <ImageBackground source={require("../../assets/background_placeholder.png")} style={styles.container}>
            <FocusAwareStatusBar translucent barStyle="dark-content" />
            <View style={styles.header}>
                <View style={styles.greetingsView}>
                    <Text style={styles.greetingsText}>
                        {GetGreeting()}
                    </Text>
                    <Text style={styles.greetingsNameText}>
                        {user.first_name + "!"}
                    </Text>
                </View>
                <ProfileIcon uri={user.profile.image_url} />
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
                <Text style={[styles.title, { paddingTop: 0 }]}>
                    Seu nível
                </Text>
                <Pressable style={[elements.subContainerGreen, theme.shadowProperties, { flexDirection: "row" }]} onPress={() => { navigation.navigate("Level") }}>
                    <View>
                        <Text style={styles.subtitle}>
                            Nível Atual:
                        </Text>
                        <Text style={styles.info}>
                            {LEVELS_DATA[user.profile.level].title}
                        </Text>
                    </View>
                    <Image source={LEVELS_DATA[user.profile.level].icon} />
                </Pressable>

                <Text style={styles.title}>
                    Seu engajamento
                </Text>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 100 }]}>
                    <Text style={styles.subtitle}>
                        Focos de lixo encontrados por você este mês:
                    </Text>
                    <Text style={[styles.info, { fontSize: 36, textAlign: "center" }]}>
                        {userReportsInMonthAmount === 1 ? `1 foco de lixo` : userReportsInMonthAmount + " focos de lixo"}
                    </Text>
                </View>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 125, marginTop: 17 }]}>
                    <Text style={styles.subtitle}>
                        {userReportsInMonthAmount === 1 ? `Deste 1 foco,` : `Destes ${userReportsInMonthAmount} focos,`}
                    </Text>
                    <Text style={[styles.info, { flex: 1, textAlign: "center", textAlignVertical: "center" }]}>
                        {userReportsSolvedInMonthAmount === 1 ? `1 já foi recolhido pelos órgãos responsáveis` : userReportsSolvedInMonthAmount + " já foram recolhidos pelos órgãos responsáveis"}
                    </Text>
                </View>

                <View style={styles.communityTitle}>
                    <Text style={[styles.title, { marginLeft: 12 }]}>
                        Engajamento da Comunidade
                    </Text>
                    <MapScopePicker changedScope={getScopePicked} actualRegion={region} />
                </View>
                <View style={[elements.subContainerGreen, theme.shadowProperties, { height: 256 }]}>
                    <Text style={[styles.info, { fontSize: 36 }]}>
                        {userReportsInMonthAmount === 1 ? `1 foco de lixo` : `${userReportsInMonthAmount} focos de lixo`}
                    </Text>
                    <Text style={styles.subtitle}>
                        {userReportsInMonthAmount === 1 ? `foi encontrado ${scopeText}` : `foram encontrados ${scopeText}`}
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
                                    CheckAvailability(locationChangedResult.nativeEvent.coordinate)
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
                        </MapView>
                    </View>
                </View>
                <ModalBase
                    title="Opa! Parece que algo deu errado..."
                    description={errorMessage}
                    isVisible={errorModalVisible}
                    backButton={true}
                    toggleModal={() => {
                        if (isAvailable) {
                            setErrorModalVisible(!errorModalVisible)
                        } else {
                            signOut()
                        }
                    }}
                    onBackdropPress={() => { }}
                />
                <View style={{ height: 100 }} />
            </ScrollView>
        </ImageBackground>
    );
}