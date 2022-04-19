import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, ImageBackground, Linking } from "react-native";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { TextButton } from "../../components/TextButton";
import { ModalBase } from "../../components/ModalBase";
import { BottomBar } from "../../components/BottomBar";
import { SectionTitle } from "../../components/SectionTitle";
import { ProfileModal } from "../../components/ProfileModal";
import { DefaultCityPicker } from "../../components/ProfilePickers/DefaultCity";
import { MapScopePicker } from "../../components/MapScopePicker";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";
import { styles } from "./styles";
import { Entypo } from "@expo/vector-icons"

import { useAuth } from "../../hooks/useAuth";

import { ListMarkersOnMap } from "../../utils/functions/ListMarkersOnMap";
import { CITIES_DATA } from "../../utils/data/cities";

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

import { Profile, RegionType } from "../../@types/application";
import { api } from "../../utils/api";
import { UpdateNavigationBar } from "../../utils/functions/UpdateNavigationBar";

const defaultServerCity = "Maceió, Alagoas - Brasil"
let defaultCity = "Maceió, Alagoas - Brasil"

export function Community() {
    const { user, updateUser } = useAuth();

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
        const markersArray = await ListMarkersOnMap(user, scope, newRegion ? newRegion : region)
        setMarkers(markersArray)
    }

    const [profilesInCityAmount, setProfilesInCityAmount] = useState(0)
    async function GetProfilesInCityAmount() {
        const usersInLocationResults = await api.post("/profiles/search", {
            location: user.profile.defaultCity.split(",")[0],
        })
        const profiles = usersInLocationResults.data as Array<Profile>;
        setProfilesInCityAmount(profiles.length)
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
        GetProfilesInCityAmount()
    }, []);

    let mapReference: any;
    const [region, setRegion] = useState({
        latitude: -14.2400732,
        longitude: -53.1805017,
        latitudeDelta: 35,
        longitudeDelta: 35
    } as RegionType);

    const [alreadyLoaded, setAlreadyLoaded] = useState(false)

    const getCityPicked = async (scope, newRegion?) => {
        defaultCity = scope;
    }

    const [isCityModalVisible, setCityModalVisible] = useState(false);
    const toggleCityModal = () => {
        setCityModalVisible(!isCityModalVisible);
    };

    const [updatingProfile, setUpdatingProfile] = useState(false)
    async function UpdateDefaultCity() {
        setUpdatingProfile(true)
        const profileResponse = await api.post("/profile/update", {
            profile_id: user.profile.id,
            defaultCity: defaultCity === null ? defaultServerCity : defaultCity
        })
        const updatedProfile = profileResponse.data as Profile;
        if (updatedProfile) {
            await updateUser(updatedProfile, "profile");
        }
        defaultCity = null
        setCityModalVisible(false)
        setUpdatingProfile(false)
    }

    const CITY_DATA = CITIES_DATA[user.profile.defaultCity]

    return (
        <ImageBackground source={require("../../assets/placeholders/background_placeholder.png")} style={styles.container}>
            <FocusAwareStatusBar translucent barStyle="dark-content" />
            <ModalBase
                title="Alterar cidade padrão"
                isVisible={isCityModalVisible}
                onBackdropPress={() => updatingProfile ? null : setCityModalVisible(false)}
                toggleModal={() => { setCityModalVisible(false) }}
            >
                <DefaultCityPicker changedScope={getCityPicked} />
                <TextButton
                    title="ALTERAR CIDADE"
                    textStyle={{ fontSize: 12 }}
                    isLoading={updatingProfile}
                    disabled={updatingProfile}
                    onPress={UpdateDefaultCity}
                    buttonStyle={{ backgroundColor: theme.colors.primary2, paddingVertical: 10, paddingHorizontal: 25, borderRadius: 25 }}
                />
            </ModalBase>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Comunidade
                </Text>
            </View>
            <ScrollView style={{ width: "100%", flex: 1 }} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} fadingEdgeLength={25} >
                <SectionTitle title="Sua Cidade" info={`${profilesInCityAmount} usuários`} hasLine />
                <View style={styles.mapView}>
                    <MapView
                        style={{ flex: 1, borderRadius: 10, justifyContent: "center" }}
                        ref={mapReference}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
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
                                if (mapReference !== undefined) {
                                    mapReference.animateToRegion(newRegion, 2000)
                                }
                                getScopePicked("district", newRegion)
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
                    <View style={{ position: "absolute", bottom: 0, right: 0 }}>
                        <MapScopePicker changedScope={getScopePicked} actualRegion={region} biggerScope />
                    </View>
                </View>
                <BottomBar
                    viewStyle={{ width: "90%" }}
                    element={
                        <Pressable style={styles.button} onPress={toggleCityModal}>
                            <Text style={styles.info}>{user.profile.defaultCity}</Text>
                            <Entypo name="chevron-small-down" size={22} color="white" />
                        </Pressable>
                    }
                />

                <SectionTitle title="Enquetes" info="disponíveis em breve" hasLine viewStyle={{ marginTop: 25 }} />
                <View style={[elements.subContainerWhite, { height: 25 }]}>

                </View>

                {
                    CITY_DATA ?
                        <>
                            <SectionTitle title="Contato" hasLine viewStyle={{ marginTop: 25 }} />
                            <SectionTitle title={`Órgão Responsável (${CITY_DATA.name})`} fontStyle={{ fontSize: 18 }} viewStyle={{ marginBottom: 5 }} />
                            <View style={[elements.subContainerWhite, { flexDirection: "row", padding: 0 }]}>
                                <View style={{ width: "65%", paddingLeft: 12, paddingVertical: 12 }}>
                                    <Pressable onPress={() => { Linking.openURL(CITY_DATA.contact.url) }}>
                                        <Text style={[styles.contactInfo, { textDecorationLine: "underline" }]}>
                                            • {CITY_DATA.contact.name}{"\n"}
                                            <Text style={{ fontFamily: theme.fonts.subtitle700 }}>
                                                {`(${CITY_DATA.contact.acronym})`}
                                            </Text>
                                        </Text>
                                    </Pressable>
                                    <Pressable onPress={() => { Linking.openURL(`tel:${CITY_DATA.contact.number}`) }}>
                                        <Text style={styles.contactInfo}>
                                            • Disque Limpeza:{'\n'}
                                            <Text style={{ fontFamily: theme.fonts.subtitle700, textDecorationLine: "underline" }}>
                                                {CITY_DATA.contact.number}
                                            </Text>
                                        </Text>
                                    </Pressable>
                                </View>
                                <Image style={{ width: "35%", borderTopRightRadius: 15, borderBottomRightRadius: 15, height: "100%" }} source={{ uri: CITY_DATA.contact.image }} />
                            </View>
                        </>
                        : null
                }
                <View style={{ height: 135 }} />

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
            </ScrollView>
        </ImageBackground>
    );
}