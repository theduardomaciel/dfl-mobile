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

import { Region, Report, User } from "../../@types/application";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    LOCATION_STORAGE, REPORTS_STORAGE,
} from "../../hooks/useAuth";

import * as Location from "expo-location";
import { LocationGeocodedAddress } from "expo-location";

export async function ListMarkersOnMap(scope: string, userRegion: Region) {

    const markersArray = []
    const reportsUnparsed = await AsyncStorage.getItem(REPORTS_STORAGE);
    const reports = await JSON.parse(reportsUnparsed) as Array<Report>

    let userLocation;
    if (userRegion) {
        const onlineResult = await Location.reverseGeocodeAsync({ latitude: userRegion.latitude, longitude: userRegion.longitude })
        userLocation = onlineResult[0]
        //console.log("Coordenadas foram fornecidas. O seguinte endereço foi encontrado: ", userLocation)
    } else {
        userLocation = JSON.parse(await AsyncStorage.getItem(LOCATION_STORAGE));
        //console.log("Utilizando a localização armazenada. O seguinte endereço foi encontrado: ", userLocation)
    }
    if (!userLocation) {
        console.log("Não foi possível obter o endereço do usuário.");
        return ["error"]
    }

    switch (scope) {
        case "district":
            const district = userLocation.district.replace(/ /g, '')
            reports.forEach((report) => {
                const reportDistrict = report.address.split(",")[2].replace(/ /g, '');
                console.log(reportDistrict, district)
                if (reportDistrict === district) {
                    markersArray.push(report)
                }
            })
            console.log(markersArray)
            return markersArray;
        case "city":
            const city = userLocation.city ? userLocation.city.replace(/ /g, '') : userLocation.subregion.replace(/ /g, '')
            reports.forEach((report) => {
                const reportCity = report.address.split(",")[3].replace(/\s/g, '');
                if (city === reportCity) {
                    markersArray.push(report)
                }
            })
            return markersArray;
        case "state":
            const state = userLocation.region.replace(/ /g, '')
            reports.forEach((report) => {
                const reportState = report.address.split(",")[4].replace(/\s/g, '');
                if (state === reportState) {
                    markersArray.push(report)
                }
            })
            return markersArray;
        case "country":
            reports.forEach((report) => {
                markersArray.push(report)
            })
            return markersArray;
    }
}