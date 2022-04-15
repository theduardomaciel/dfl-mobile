import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';

import { theme } from "../../../global/styles/theme";

import { defaultStyles } from "../defaultStyles";
import { styles } from "./styles";

import { AntDesign } from '@expo/vector-icons';
import { BottomBar } from "../../../components/BottomBar";
import { TextButton } from "../../../components/TextButton";

async function getLocationAddress(latitude: number, longitude: number) {
    try {
        const fullAddress = await Location.reverseGeocodeAsync({ latitude: latitude, longitude: longitude })
        if (!fullAddress) {
            return getLocationAddress(latitude, longitude)
        }
        const address = fullAddress[0].street + ", "
            + fullAddress[0].postalCode + ", "
            + fullAddress[0].district + ", "
            + fullAddress[0].subregion + ", "
            + fullAddress[0].region + ", "
            + fullAddress[0].country
        return address
    } catch (error) {
        console.log(error)
    }
}

// Coordenadas iniciais são o Brasil :)
const initialRegion = {
    latitude: -23.6821604,
    longitude: -46.9057052,
    latitudeDelta: 35,
    longitudeDelta: 35
}

import changeNavigationBarColor, {
    showNavigationBar,
} from 'react-native-navigation-bar-color';

export function ReportScreen1({ navigation }: any) {
    const [region, setRegion] = useState(initialRegion);
    const [address, setAddress] = useState("");

    function cacheLocation() {
        const coordinates = [region.latitude, region.longitude]
        const data = {
            coordinates: coordinates,
            address: address
        }
        return data;
    }

    useEffect(() => {
        changeNavigationBarColor(theme.colors.background, false, true);
        showNavigationBar()
    }, []);

    let mapReference: any;
    return (
        <View style={defaultStyles.container}>
            <View style={defaultStyles.safeView}>
                <View style={defaultStyles.header}>
                    <Text style={defaultStyles.stepTitle}>1 | LOCAL DO FOCO</Text>
                    <AntDesign name="left" size={24} color={theme.colors.primary1} onPress={() => navigation.goBack()} />
                </View>
                <Text style={defaultStyles.title}>
                    Fique o mais próximo possível de onde está o foco de lixo.
                </Text>
                <View style={styles.mapView}>
                    <MapView
                        style={{ flex: 1, borderRadius: 10, justifyContent: "center" }}
                        provider={PROVIDER_GOOGLE}
                        ref={ref => mapReference = ref}
                        onMapReady={async () => {
                            console.log("Mapa carregou.")
                        }}
                        /* userLocationFastestInterval={5000}
                        userLocationUpdateInterval={10000} */
                        onRegionChangeComplete={() => {
                            mapReference.animateToRegion(region, 2000)
                        }}
                        onUserLocationChange={locationChangedResult => {
                            const coords = locationChangedResult.nativeEvent.coordinate
                            const newRegion = {
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005
                            }
                            setRegion(newRegion);
                            async function UpdateAddress() {
                                const address = await getLocationAddress(newRegion.latitude, newRegion.longitude)
                                if (address !== undefined) {
                                    setAddress(address)
                                }
                            }
                            UpdateAddress()
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        initialRegion={region}
                    />
                </View>
                <BottomBar info={"Endereço: " + address} viewStyle={{ height: 50 }} />
                <TextButton
                    title="Próximo passo"
                    colors={address === "" ? [theme.colors.gray_light, theme.colors.gray_dark] : [theme.colors.secondary1, theme.colors.secondary2]}
                    buttonStyle={{ height: 45, width: "90%", marginTop: 20, marginBottom: 25 }}
                    disabled={address === "" ? true : false}
                    onPress={() => {
                        const data = cacheLocation()
                        console.log("Dados cadastrados até o momento: ", data)
                        navigation.navigate("Step2", { data })
                    }}
                />
            </View>
        </View>
    );
}