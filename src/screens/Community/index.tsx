import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, ImageBackground, Dimensions } from "react-native";

import MapView, { PROVIDER_GOOGLE, Marker, Geojson } from "react-native-maps";

import { ProfileModal } from "../../components/ProfileModal";
import { MapScopePicker } from "../../components/MapScopePicker";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";
import { styles } from "./styles";

import { Entypo, MaterialIcons } from "@expo/vector-icons"

import { useAuth } from "../../hooks/useAuth";

import { ListMarkersOnMap } from "../../utils/functions/ListMarkersOnMap";
import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";

/* Marcadores = [
    {
        title: "Marcador 1",
        description: "Coiso",
        coordinates: {
            latitude: 39.09802,
            longitude: 43.14820
        }
    },
] */

import { Profile, Region } from "../../@types/application";
import { api } from "../../utils/api";
import { UpdateNavigationBar } from "../../utils/functions/UpdateNavigationBar";
import { TextForm } from "../../components/TextForm";

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

    const [markers, setMarkers] = useState([])
    const getScopePicked = async (scope, newRegion?) => {
        if (newRegion) setRegion(newRegion);
        const markersArray = await ListMarkersOnMap(scope, newRegion ? newRegion : region)
        setMarkers(markersArray)
    }

    useEffect(() => {
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
        </ImageBackground>
    );
}