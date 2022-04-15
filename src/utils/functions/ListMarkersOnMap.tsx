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

import { User, Report } from "../../@types/application";

export function ListMarkersOnMap(reports: Array<Report>, user: User, scope: string, district?: string) {
    if (reports !== undefined) {
        let markersArray = []
        switch (scope) {
            case "district":
                if (district) {
                    reports.forEach((report) => {
                        const fullAddress = report.address.split(",");
                        if (fullAddress[2].replace(/ /g, '') === district) {
                            console.log("Um relatório compatível foi encontrado com o escopo de bairro.")
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
                    console.log("Atualizando marcadores no escopo de bairro.")
                } else {
                    console.log("O bairro do usuário não foi fornecido.")
                }
                return markersArray;
            case "city":
                const defaultCity = user.profile.defaultCity.split(",")[0].replace(/ /g, '');
                reports.forEach((report) => {
                    const reportCity = report.address.split(",")[3].replace(/\s/g, '');
                    if (defaultCity === reportCity) {
                        console.log("Um relatório compatível foi encontrado com o escopo de cidade.")
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
                console.log("Atualizando marcadores no escopo de cidade.")
                return markersArray;
            case "state":
                const defaultState = user.profile.defaultCity.split(",")[1].split("-")[0].replace(/\s/g, '');
                reports.forEach((report) => {
                    const reportState = report.address.split(",")[4].replace(/\s/g, '');
                    console.log(defaultState, reportState)
                    if (reportState === defaultState) {
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
                const defaultCountry = user.profile.defaultCity.split("-")[1].replace(/\s/g, '');
                reports.forEach((report) => {
                    const reportCounty = report.address.split(",")[5].replace(/\s/g, '');
                    if (reportCounty === defaultCountry) {
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
        }
    }
}