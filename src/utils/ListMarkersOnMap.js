export function ListMarkersOnMap(user, scope) {
    if (user.reports !== undefined) {
        switch (scope) {
            case "district":
                let markersArray = []
                user.reports.forEach((report) => {
                    markersArray.push({
                        title: report.address,
                        description: report.suggestion,
                        coordinates: {
                            latitude: typeof report.coordinates[0] !== "number" ? parseFloat(report.coordinates[0]) : report.coordinates[0],
                            longitude: typeof report.coordinates[1] !== "number" ? parseFloat(report.coordinates[1]) : report.coordinates[0],
                        }
                    })
                })
                return markersArray
                break;
            case "city":

                break;
        }
    }
}