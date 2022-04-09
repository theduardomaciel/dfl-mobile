export function ListMarkersOnMap(user, scope) {
    const userReports = user.profile.reports;
    if (userReports !== undefined) {
        switch (scope) {
            case "district":
                let markersArray = []
                userReports.forEach((report) => {
                    markersArray.push({
                        title: report.address,
                        description: report.suggestion,
                        coordinates: {
                            latitude: typeof report.coordinates[0] !== "number" ? parseFloat(report.coordinates[0]) : report.coordinates[0],
                            longitude: typeof report.coordinates[1] !== "number" ? parseFloat(report.coordinates[1]) : report.coordinates[0],
                        }
                    })
                })
                console.log(markersArray)
                return markersArray;
                break;
            case "city":
                break;
        }
    }
}