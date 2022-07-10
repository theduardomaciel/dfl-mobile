import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, ScrollView, Image, RefreshControl, Pressable, ImageBackground, BackHandler } from "react-native";
import { MapScopePicker } from "../../components/MapScopePicker";

import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";

import { ProfileIcon } from "../../components/ProfileIcon";
import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

import { useAuth } from "../../hooks/useAuth";
import { Region } from "../../@types/application";

import ListMarkersOnMap from "../../utils/functions/ListMarkersOnMap";
import { ModalBase } from "../../components/ModalBase";
import { LEVELS_DATA } from "../../utils/data/levels";

import { MaterialIcons } from '@expo/vector-icons';

import * as Location from "expo-location"

import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";
import { locationPermission } from "../../utils/permissionsToCheck";

import { check, RESULTS } from 'react-native-permissions';

function GetGreeting() {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
        return "Bom dia,";
    } else if (hour >= 12 && hour < 18) {
        return "Boa tarde,";
    } else {
        return "Boa noite,";
    }
}

const initialRegion = {
    latitude: -23.6821604,
    longitude: -46.9057052,
    latitudeDelta: 35,
    longitudeDelta: 35
}

import { FocusCallout } from "../Community/Callouts/FocusCallout";

import { hideNavigationBar } from 'react-native-navigation-bar-color';
import { ProfileModal } from "../../components/ProfileModal";

import { TextButton } from "../../components/TextButton";
import { api } from "../../utils/api";

export function Home({ route, navigation }) {
    const [errorMessage, setErrorMessage] = useState(" ");

    const { user, updateProfile } = useAuth();

    let mapReference: any;
    const [alreadyLoaded, setAlreadyLoaded] = useState(false)

    function checkData() {
        if (route.params?.errorMessage) {
            console.log("Error Message: ", route.params?.errorMessage)
            setErrorMessage(route.params?.errorMessage)
        }
        check(locationPermission)
            .then(async (result) => {
                if (result !== RESULTS.GRANTED) return navigation.navigate("PermissionsRequest", { permission: "location" });
            });
        hideNavigationBar()
        CheckIfProfileIsCreated()
    }

    const [isFirstModalVisible, setFirstModalVisible] = useState(false)
    const firstToggleModal = () => {
        setFirstModalVisible(!isFirstModalVisible)
    }
    async function CheckIfProfileIsCreated() {
        if (!user.profile.username) {
            console.log("Usuário não possui perfil. Exibindo modal para criação.")
            setFirstModalVisible(true)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', checkData);
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const [region, setRegion] = useState(initialRegion as Region);
    const [scopeText, setScopeText] = useState("em seu bairro")
    const [reports, setReports] = useState([]);

    const [reportsInScopeAmount, setReportsInScopeAmount] = useState(0)
    const getScopePicked = async (scope, newRegion?) => {
        if (newRegion) setRegion(newRegion);
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
        const markersArray = await ListMarkersOnMap(scope, newRegion)
        if (markersArray) {
            setReports(markersArray)
            setReportsInScopeAmount(markersArray.length)
        }
    }

    const [isRefreshing, setIsRefreshing] = useState(false)
    const onRefresh = async () => {
        setIsRefreshing(true)

        await updateProfile()
        getScopePicked("district")

        setIsRefreshing(false)
        console.log("Usuário atualizou a página inicial.")
    }

    const [isAvailable, setIsAvailable] = useState(true)
    const appVersion = "3"

    const outdatedMessage = "Epa! Parece que você está usando uma versão desatualizada do aplicativo.\nPedimos que desinstale essa versão desatualizada do seu dispositivo para evitar problemas."

    async function CheckAvailability(coords) {
        getScopePicked("district")
        const userLocation = await Location.reverseGeocodeAsync(coords) as any;
        if (userLocation.city && userLocation.subRegion !== "Maceió") {
            console.log("Usuário não está em um local permitido.")
            setIsAvailable(false)
            setErrorMessage("Por enquanto, o DFL não está disponível em sua localização :(\nAguarde o lançamento oficial do aplicativo para que sua região esteja disponível.")
        } else {
            const serverVersion = await api.get("/")
            console.log("Versão do servidor: ", serverVersion.data, "Versão do app: ", appVersion)
            if (parseFloat(appVersion) < parseFloat(serverVersion.data)) {
                setIsAvailable(false)
                setErrorMessage(outdatedMessage)
            }
        }
    }

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    const userReports = user.profile.reports ? user.profile.reports : []
    const userReportsInMonthAmount = [...userReports].filter(report => new Date(report.createdAt).getMonth() === new Date().getMonth()).length
    const userReportsSolvedInMonthAmount = [...userReports].filter(report => new Date(report.createdAt).getMonth() === new Date().getMonth() && report.resolved === true).length

    return (
        <ImageBackground progressiveRenderingEnabled source={require("../../assets/placeholders/background_placeholder.png")} style={styles.container}>
            <FocusAwareStatusBar translucent backgroundColor={"transparent"} barStyle="dark-content" />
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
                //fadingEdgeLength={10}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={-10}
                        colors={[theme.colors.primary1]}
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* <TextButton buttonStyle={{ padding: 10 }} title="Ir pra tela" onPress={() => navigation.navigate("Step3", { data: {} })} /> */}
                <Text style={[styles.title, { paddingTop: 0 }]}>
                    Seu nível
                </Text>
                <Pressable style={[elements.subContainerGreen, theme.shadowProperties, { flexDirection: "row" }]} onPress={() => { navigation.navigate("Level") }}>
                    <View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.subtitle}>
                                Nível Atual:
                            </Text>
                            <MaterialIcons name="keyboard-arrow-right" size={18} color={theme.colors.text1} />
                        </View>
                        <Text style={styles.info}>
                            {LEVELS_DATA[user.profile.level].title}
                        </Text>
                    </View>
                    <Image progressiveRenderingEnabled source={LEVELS_DATA[user.profile.level].icon} />
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
                        {userReportsInMonthAmount === 1 ? `Desse 1 foco,` : `Desses ${userReportsInMonthAmount} focos,`}
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
                        {reportsInScopeAmount === 1 ? `1 foco de lixo` : `${reportsInScopeAmount} focos de lixo`}
                    </Text>
                    <Text style={styles.subtitle}>
                        {reportsInScopeAmount === 1 ? `foi encontrado ${scopeText}` : `foram encontrados ${scopeText}`}
                    </Text>
                    <View style={styles.mapView}>
                        <MapView
                            style={{ flex: 1, borderRadius: 10, justifyContent: "center" }}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            ref={ref => mapReference = ref}
                            showsMyLocationButton={true}
                            region={region}
                            loadingEnabled
                            toolbarEnabled={false}
                            loadingIndicatorColor={theme.colors.primary1}
                            loadingBackgroundColor={theme.colors.background}
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
                                    setRegion(newRegion as Region);
                                    mapReference.animateToRegion(newRegion, 2000)
                                }
                            }}
                        >
                            {
                                reports ?
                                    reports.map((report, index) => (
                                        <Marker
                                            key={index}
                                            image={{ uri: "trashfocus_icon" }}
                                            coordinate={{
                                                latitude: parseFloat(report.coordinates[0]),
                                                longitude: parseFloat(report.coordinates[1])
                                            }}
                                            calloutAnchor={{ x: 4.825, y: -0.15 }}
                                        >
                                            <Callout tooltip onPress={() => {
                                                navigation.navigate("Report", { item: report })
                                            }}>
                                                <FocusCallout report={report} region={region} />
                                            </Callout>
                                        </Marker>
                                    ))
                                    : null
                            }
                        </MapView>
                    </View>
                </View>

                <ProfileModal
                    isVisible={isFirstModalVisible}
                    toggleModal={firstToggleModal}
                />

                <ModalBase
                    title="Opa! Parece que algo deu errado..."
                    description={errorMessage}
                    isVisible={errorMessage !== " "}
                    backButton={true}
                    toggleModal={() => {
                        if (isAvailable) {
                            setErrorMessage(" ")
                        } else {
                            BackHandler.exitApp()
                        }
                    }}
                    onBackdropPress={() => { }}
                />
                <View style={{ height: 100 }} />
            </ScrollView>
        </ImageBackground>
    );
}