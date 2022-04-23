/* 
    report.address (split)
    [0] = endereço / rua
    [1] = CEP
    [2] = bairro
    [3] = cidade
    [4] = estado
    [5] = país

    profile.defaultCity
    [0] = cidade
    [1] = estado
    [2] = país
*/

import { Region, User } from "../../@types/application";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    LOCATION_STORAGE, REPORTS_STORAGE,
} from "../../hooks/useAuth";

import * as Location from "expo-location";
import { LocationGeocodedAddress } from "expo-location";

export async function ListMarkersOnMap(scope: string, userRegion: Region) {
    const markersArray = []
    const reports = JSON.parse(await AsyncStorage.getItem(REPORTS_STORAGE));
    const userLocation = userRegion ? await Location.reverseGeocodeAsync({ latitude: userRegion.latitude, longitude: userRegion.longitude }) :
        JSON.parse(await AsyncStorage.getItem(LOCATION_STORAGE));
    switch (scope) {
        case "district":
            const district = userLocation.district
            reports.forEach((report) => {
                const reportDistrict = report.address.split(",")[2].replace(/ /g, '');
                console.log(reportDistrict, district)
                if (reportDistrict === district) {
                    markersArray.push({
                        title: report.address,
                        description: report.suggestion,
                        coordinates: {
                            latitude: typeof report.coordinates[0] !== "number" ? parseFloat(report.coordinates[0]) : report.coordinates[0],
                            longitude: typeof report.coordinates[1] !== "number" ? parseFloat(report.coordinates[1]) : report.coordinates[0],
                        }
                    })
                }
            })
            return markersArray;
        case "city":
            const city = userLocation.city ? userLocation.city : userLocation.region
            reports.forEach((report) => {
                const reportCity = report.address.split(",")[3].replace(/\s/g, '');
                if (city === reportCity) {
                    markersArray.push({
                        title: report.address,
                        description: report.suggestion,
                        coordinates: {
                            latitude: typeof report.coordinates[0] !== "number" ? parseFloat(report.coordinates[0]) : report.coordinates[0],
                            longitude: typeof report.coordinates[1] !== "number" ? parseFloat(report.coordinates[1]) : report.coordinates[0],
                        }
                    })
                }
            })
            return markersArray;
        case "state":
            const state = userLocation.region;
            reports.forEach((report) => {
                const reportState = report.address.split(",")[4].replace(/\s/g, '');
                if (state === reportState) {
                    markersArray.push({
                        title: report.address,
                        description: report.suggestion,
                        coordinates: {
                            latitude: typeof report.coordinates[0] !== "number" ? parseFloat(report.coordinates[0]) : report.coordinates[0],
                            longitude: typeof report.coordinates[1] !== "number" ? parseFloat(report.coordinates[1]) : report.coordinates[0],
                        }
                    })
                }
            })
            return markersArray;
        case "country":
            const country = userLocation.country;
            reports.forEach((report) => {
                markersArray.push({
                    title: report.address,
                    description: report.suggestion,
                    coordinates: {
                        latitude: typeof report.coordinates[0] !== "number" ? parseFloat(report.coordinates[0]) : report.coordinates[0],
                        longitude: typeof report.coordinates[1] !== "number" ? parseFloat(report.coordinates[1]) : report.coordinates[0],
                    }
                })
            })
            return markersArray;
    }
}