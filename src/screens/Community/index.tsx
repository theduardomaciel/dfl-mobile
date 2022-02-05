import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StatusBar, Pressable, Button } from "react-native";
import * as Location from 'expo-location';

import Modal from "react-native-modal"
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { BottomBar } from "../../components/BottomBar";

//import MapView from "react-native-maps";

import { ProfileIcon } from "../../components/ProfileIcon";
import { SectionTitle } from "../../components/SectionTitle";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

import { Entypo } from '@expo/vector-icons';
import { TextButton } from "../../components/TextButton";
import { ModalBase } from "../../components/ModalBase";

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
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [alreadyLoaded, setAlreadyLoaded] = useState(false)

    /* const [location, setLocation] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
 */
    const [region, setRegion] = useState(initialRegion);
    let mapReference: any;
    return (
        <View style={styles.container}>
            <ModalBase
                title="Alterar cidade padrão"
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                toggleModal={() => { setModalVisible(false) }}
            >
                <Text>Essa é a descrição do modal.</Text>
                <TextButton title="ALTERAR CIDADE" buttonStyle={{ height: 40, width: 180, backgroundColor: theme.colors.primary1, borderRadius: 25 }} />
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
                        <Pressable style={styles.button} onPress={toggleModal}>
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