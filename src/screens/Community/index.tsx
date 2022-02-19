import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StatusBar, Pressable } from "react-native";

import Modal from "react-native-modal"
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { TextButton } from "../../components/TextButton";
import { ModalBase } from "../../components/ModalBase";
import { BottomBar } from "../../components/BottomBar";
import { SectionTitle } from "../../components/SectionTitle";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";
import { styles } from "./styles";

import { Entypo } from '@expo/vector-icons';

import { useAuth } from "../../hooks/auth";
import { ProfileModal } from "../../components/ProfileModal";
import { DefaultCityPicker } from "../../components/ProfilePickers/DefaultCity";

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
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
}

export function Community() {
    const [alreadyLoaded, setAlreadyLoaded] = useState(false)
    const { user } = useAuth();

    const [isProfileModalVisible, setProfileModalVisible] = useState(false)
    const [secondModalIsVisible, setSecondModalVisible] = useState(false)
    useEffect(() => {
        function CheckIfProfileIsCreated() {
            console.log(user.profile)
            if (user.profile === undefined) {
                setProfileModalVisible(true)
            }
        }
        CheckIfProfileIsCreated()
        //setTimeout(CheckIfProfileIsCreated, 1000);
    }, []);

    const [isCityModalVisible, setCityModalVisible] = useState(false);
    const toggleCityModal = () => {
        setCityModalVisible(!isCityModalVisible);
    };

    const secondToogleModal = () => {
        setSecondModalVisible(!secondModalIsVisible)
    }

    const [region, setRegion] = useState(initialRegion);
    let mapReference: any;
    return (
        <View style={styles.container}>
            <ProfileModal isVisible={isProfileModalVisible} toggleModal={() => { setProfileModalVisible(!isProfileModalVisible) }} secondToogleModal={secondToogleModal} />
            <ProfileModal isSecond isVisible={secondModalIsVisible} toggleModal={secondToogleModal} />
            <ModalBase
                title="Alterar cidade padrão"
                isVisible={isCityModalVisible}
                onBackdropPress={() => setCityModalVisible(false)}
                toggleModal={() => { setCityModalVisible(false) }}
            >
                <DefaultCityPicker />
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