export function ListMarkersOnMap(user, scope, district?) {
    const userReports = user.profile.reports;
    if (userReports !== undefined) {
        let markersArray = []
        switch (scope) {
            case "district":
                userReports.forEach((report) => {
                    const fullAddress = report.address.split(",");
                    console.log(fullAddress)
                    if (fullAddress[2] === district) {
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
                userReports.forEach((report) => {
                    if (report.address.split(",")[3] === user.profile.defaultCity.split(",")[0]) {
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
                userReports.forEach((report) => {
                    if (report.address.split(",")[4] === user.profile.defaultCity.split(",")[1]) {
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
                userReports.forEach((report) => {
                    if (report.address.split(",")[5] === user.profile.defaultCity.split("-")[1]) {
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
                break;
        }
    }
}