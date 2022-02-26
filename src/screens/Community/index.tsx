import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StatusBar, Pressable } from "react-native";

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
import { ListMarkersOnMap } from "../../utils/ListMarkersOnMap";

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
            if (user.profile === undefined) {
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

    return (
        <View style={styles.container}>
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

                <SectionTitle title="Enquetes" info="termina em 12h31m" />
                <View style={elements.subContainerWhite}>

                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}