import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { View, Text } from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';

import { theme } from "../../../global/styles/theme";

import { defaultStyles } from "../defaultStyles";
import { styles } from "./styles";

import { AntDesign } from '@expo/vector-icons';
import { BottomBar } from "../../../components/BottomBar";
import { TextButton } from "../../../components/TextButton";

// Dispatch<SetStateAction<{}>>
/* async function getCurrentLocation() {
    try {
        const geoLocation = await Location.getCurrentPositionAsync({});
        const coords = geoLocation.coords;
        const region = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        }!;
        return region
    } catch (error) {
        console.log(error)
    }
} */
async function getLocationAddress(latitude: number, longitude: number) {
    try {
        const fullAddress = await Location.reverseGeocodeAsync({ latitude: latitude, longitude: longitude })
        const address = fullAddress[0].street + ", " + fullAddress[0].streetNumber + ", " + fullAddress[0].postalCode + " - " + fullAddress[0].subregion + ", " + fullAddress[0].region
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

export function ReportScreen1({ navigation }: any) {
    const [region, setRegion] = useState(initialRegion);
    const [address, setAddress] = useState("");

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
                        onUserLocationChange={locationChangedResult => {
                            const coords = locationChangedResult.nativeEvent.coordinate
                            const newRegion = {
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005
                            }
                            setRegion(newRegion);
                            mapReference.animateToRegion(newRegion, 2000)
                            async function UpdateAddress() {
                                const address = await getLocationAddress(newRegion.latitude, newRegion.longitude)
                                if (address !== undefined) {
                                    setAddress(address)
                                }
                            }
                            UpdateAddress()
                        }}
                        /* region={region} */
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        initialRegion={initialRegion}
                    />
                </View>
                <BottomBar info={"Endereço: " + address} margin={25} />
                <TextButton
                    title="Próximo passo"
                    colors={[theme.colors.secondary1, theme.colors.secondary2]}
                    buttonStyle={{ height: 45, width: "90%", position: "absolute", bottom: 20, }}
                    onPress={() => navigation.navigate("Step2")}
                />
            </View>
        </View>
    );
}