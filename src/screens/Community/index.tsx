import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground } from "react-native";

import MapView, { PROVIDER_GOOGLE, Marker, Geojson, Callout } from "react-native-maps";

import { ProfileModal } from "../../components/ProfileModal";
import { MapScopePicker } from "../../components/MapScopePicker";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";
import { styles } from "./styles";
import { triangleSize } from "./Callouts/calloutStyles";

const GarbageBagIcon = require("../../assets/icons/garbage_bag.png")
import { Entypo, MaterialIcons } from "@expo/vector-icons"

import { useAuth } from "../../hooks/useAuth";

import { ListMarkersOnMap } from "../../utils/functions/ListMarkersOnMap";
import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";

import { Region } from "../../@types/application";
import { api } from "../../utils/api";
import { UpdateNavigationBar } from "../../utils/functions/UpdateNavigationBar";
import { TextForm } from "../../components/TextForm";
import { FocusCallout } from "./Callouts/FocusCallout";

let loadedUserLocation = false;

export function Community({ navigation }) {
    const { user } = useAuth();

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    const [isFirstModalVisible, setFirstModalVisible] = useState(false)
    const firstToggleModal = () => {
        setFirstModalVisible(!isFirstModalVisible)
    }

    const [isSecondModalVisible, setSecondModalVisible] = useState(false)
    const secondToggleModal = () => {
        setSecondModalVisible(!isSecondModalVisible)
    }

    const [reports, setReports] = useState([])
    const getScopePicked = async (scope, newRegion?) => {
        if (newRegion) setRegion(newRegion);
        const markersArray = await ListMarkersOnMap(scope, newRegion)
        setReports(markersArray)
    }

    useEffect(() => {
        getScopePicked("city")
        UpdateNavigationBar(null, false, "black")
        function CheckIfProfileIsCreated() {
            if (user.profile.defaultCity === null || user.profile.defaultCity === "") {
                console.log("Usuário não possui perfil. Exibindo modal para criação.")
                setFirstModalVisible(true)
            }
        }
        CheckIfProfileIsCreated()
    }, []);

    let mapReference: any;
    const [region, setRegion] = useState({
        latitude: -14.2400732,
        longitude: -53.1805017,
        latitudeDelta: 35,
        longitudeDelta: 35
    } as Region);

    return (
        <ImageBackground source={require("../../assets/placeholders/background_placeholder.png")} style={styles.container}>
            <FocusAwareStatusBar translucent barStyle="dark-content" />

            <View style={styles.container}>
                <MapView
                    style={{ height: "100%", width: "100%" }}
                    ref={mapReference}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    minZoomLevel={10}
                    maxZoomLevel={17}
                    mapPadding={{
                        bottom: 0, top: 125, left: 15, right: 15
                    }}
                    loadingEnabled
                    loadingIndicatorColor={theme.colors.primary1}
                    loadingBackgroundColor={theme.colors.background}
                    region={region}
                    onUserLocationChange={locationChangedResult => {
                        if (!loadedUserLocation) {
                            const coords = locationChangedResult.nativeEvent.coordinate
                            const newRegion = {
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05
                            }
                            setRegion(newRegion);
                            if (mapReference !== undefined) {
                                mapReference.animateToRegion(newRegion, 2000)
                            }
                            loadedUserLocation = true
                        }
                    }}
                >
                    {
                        reports ?
                            reports.map((report, index) => (
                                <Marker
                                    key={index}
                                    image={GarbageBagIcon}
                                    coordinate={{
                                        latitude: parseFloat(report.coordinates[0]),
                                        longitude: parseFloat(report.coordinates[1])
                                        //latitude: typeof report.coordinates[0] !== "number" ?  : report.coordinates[0],
                                        //longitude: typeof report.coordinates[0] !== "number" ? parseFloat(report.coordinates[1]) : report.coordinates[1]
                                    }}
                                    calloutAnchor={{ x: 5.5, y: -0.15 }}
                                >
                                    <Callout tooltip>
                                        <FocusCallout report={report} />
                                    </Callout>
                                </Marker>
                            ))
                            : null
                    }
                    {/* <Geojson
                        geojson={}
                        strokeColor="#FF6D6A"
                        fillColor="#ffffff80"
                        strokeWidth={5}
                    /> */}
                </MapView>
            </View>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Comunidade
                </Text>
                <TextForm
                    customStyle={styles.searchBar}
                    shadow
                    textInputProps={{
                        placeholder: `Pesquisar relatos (ex.: bairro, cidade, estado)`,
                        placeholderTextColor: theme.colors.gray_light,
                        autoCapitalize: "none",
                        onSubmitEditing: ({ nativeEvent: { text } }) => { text.length > 0 && navigation.navigate("Search", { search: text }) }
                    }}
                    icon={<MaterialIcons name="search" size={24} color={theme.colors.secondary1} />}
                />
            </View>

            <View style={{ position: "absolute", bottom: 50, right: 15 }}>
                <MapScopePicker changedScope={getScopePicked} actualRegion={region} biggerScope />
            </View>
            <ProfileModal
                isVisible={isFirstModalVisible}
                toggleModal={firstToggleModal}
                secondToggleModal={secondToggleModal}
            />
            <ProfileModal
                onBackdropPress={() => {
                    firstToggleModal()
                    secondToggleModal()
                }}
                isSecond
                isVisible={isSecondModalVisible}
                toggleModal={secondToggleModal}
                secondToggleModal={firstToggleModal}
            />
        </ImageBackground >
    );
}