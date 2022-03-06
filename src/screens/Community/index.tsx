import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StatusBar, Pressable, ImageBackground, Linking } from "react-native";

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

import { Entypo } from '@expo/vector-icons';

import { useAuth } from "../../hooks/useAuth";
import { ListMarkersOnMap } from "../../utils/functions/ListMarkersOnMap";
import { CITIES_DATA } from "../../utils/data/cities";

const Marcadores = [
    {
        title: "Marcador 1",
        description: "Coiso",
        coordinates: {
            latitude: 39.09802,
            longitude: 43.14820
        }
    },
]

const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
}

export function Community() {
    const { user } = useAuth();

    const [isFirstModalVisible, setFirstModalVisible] = useState(false)
    const [isSecondModalVisible, setSecondModalVisible] = useState(false)
    const firstToggleModal = () => {
        setFirstModalVisible(!isFirstModalVisible)
    }
    const secondToggleModal = () => {
        setSecondModalVisible(!isSecondModalVisible)
    }

    const [markers, setMarkers] = useState([])
    useEffect(() => {
        function CheckIfProfileIsCreated() {
            console.log(user.profile.defaultCity, user.profile.username)
            if (user.profile.defaultCity || user.profile.username === null) {
                console.log("Usuário não possui perfil. Exibindo modal para criação.")
                setFirstModalVisible(true)
            }
        }
        CheckIfProfileIsCreated()
        setMarkers(ListMarkersOnMap(user, "district"))
    }, []);

    const [region, setRegion] = useState(initialRegion);
    const [alreadyLoaded, setAlreadyLoaded] = useState(false)

    let mapReference: any;
    const getScopePicked = (scope, newRegion) => {
        setRegion(newRegion)
        setMarkers(ListMarkersOnMap(user, scope))
    }

    const [isCityModalVisible, setCityModalVisible] = useState(false);
    const toggleCityModal = () => {
        setCityModalVisible(!isCityModalVisible);
    };

    const [defaultCity, setDefaultCity] = "Cidade não selecionada"
    const CITY_DATA = CITIES_DATA[user.profile.defaultCity]

    return (
        <ImageBackground source={require("../../assets/background_placeholder.png")} style={styles.container}>
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
            <ModalBase
                title="Alterar cidade padrão"
                isVisible={isCityModalVisible}
                onBackdropPress={() => setCityModalVisible(false)}
                toggleModal={() => { setCityModalVisible(false) }}
            >
                <DefaultCityPicker state={defaultCity} setState={setDefaultCity} />
                <TextButton title="ALTERAR CIDADE" textStyle={{ fontSize: 12 }} buttonStyle={{ backgroundColor: theme.colors.primary2, paddingVertical: 10, paddingHorizontal: 25, borderRadius: 25 }} />
            </ModalBase>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <View style={styles.header}>
                <Text style={styles.title}>
                    Comunidade
                </Text>
            </View>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} >
                <SectionTitle title="Sua Cidade" info="212 usuários" />
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
                            }
                        }}
                        initialRegion={initialRegion}
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
                        <MapScopePicker changedScope={getScopePicked} actualRegion={region} />
                    </View>
                </View>
                <BottomBar
                    viewStyle={{ width: "90%" }}
                    element={
                        <Pressable style={styles.button} onPress={toggleCityModal}>
                            <Text style={styles.info}>Maceió</Text>
                            <Entypo name="chevron-small-down" size={22} color="white" />
                        </Pressable>
                    }
                />

                <SectionTitle title="Enquetes" info="disponível em breve" hasLine viewStyle={{ marginTop: 25 }} />
                <View style={[elements.subContainerWhite, { height: 25 }]}>

                </View>
                {
                    user.profile.defaultCity ?
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
                            <View style={{ height: 50 }} />
                        </>
                        : null
                }
            </ScrollView>
        </ImageBackground>
    );
}