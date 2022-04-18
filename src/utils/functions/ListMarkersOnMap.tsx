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

import { User, Report, RegionType } from "../../@types/application";
import * as Location from 'expo-location';
import { api } from "../api";

import AsyncStorage from '@react-native-async-storage/async-storage'
const REPORTS_STORAGE = "@dfl:reports";

let reports = null;
async function GetReportsInLocation(location: string) {
    const reportsResponse = await api.post("/reports/search", {
        location: location
    })
    return reportsResponse.data as Array<Report>;
}

export async function ListMarkersOnMap(user: User, scope: string, userRegion: RegionType) {
    let markersArray = []

    const defaultCountry = user.profile.defaultCity !== null ? user.profile.defaultCity.split("-")[1].replace(/\s/g, '') : "Brasil"

    if (reports === null) {
        reports = JSON.parse(await AsyncStorage.getItem(REPORTS_STORAGE));
        // Caso os relatórios não tenham sido previamente carregados, requisitamos os dados ao servidor e só depois listamos os marcadores no mapa
        if (reports === null) {
            const onlineReports = await GetReportsInLocation(defaultCountry)
            reports = onlineReports
            await AsyncStorage.setItem(REPORTS_STORAGE, JSON.stringify(onlineReports));
        } else {
            GetReportsInLocation(defaultCountry).then(async onlineReports => {
                await AsyncStorage.setItem(REPORTS_STORAGE, JSON.stringify(onlineReports));
                reports = onlineReports
            })
        }
    }

    switch (scope) {
        case "district":
            const result = await Location.reverseGeocodeAsync({ latitude: userRegion.latitude, longitude: userRegion.longitude });
            const district = result[0].district.replace(/ /g, '');
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
            const defaultCity = user.profile.defaultCity.split(",")[0].replace(/ /g, '');
            reports.forEach((report) => {
                const reportCity = report.address.split(",")[3].replace(/\s/g, '');
                if (defaultCity === reportCity) {
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
            const defaultState = user.profile.defaultCity.split(",")[1].split("-")[0].replace(/\s/g, '');
            reports.forEach((report) => {
                const reportState = report.address.split(",")[4].replace(/\s/g, '');
                if (defaultState === reportState) {
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