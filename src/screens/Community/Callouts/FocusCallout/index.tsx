import React from "react";
import { View, Text } from "react-native";

import { theme } from "../../../../global/styles/theme";

import { styles, triangleSize } from "../calloutStyles"
import TrashbinIcon from "../../../../assets/icons/trashbin.svg"
import GetRatingsAverage from "../../../../utils/functions/GetRatingsAverage";
import { Report } from "../../../../@types/application";
import { LatLng } from "react-native-maps";

type Props = {
    report: Report;
    region: any;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

export function FocusCallout({ report, region }: Props) {
    const totalRatings = report.note1 + report.note2 + report.note3 + report.note4 + report.note5

    const parsedCoordinates = {
        latitude: parseFloat(report.coordinates[0]),
        longitude: parseFloat(report.coordinates[1])
    }
    let userDistanceFromFocus = distanceInKmBetweenEarthCoordinates(
        parsedCoordinates.latitude,
        parsedCoordinates.longitude,
        region.latitude,
        region.longitude
    )

    let measureUnit = "km"
    if (userDistanceFromFocus < 1) {
        measureUnit = "m"
        userDistanceFromFocus = userDistanceFromFocus * 1000
    }

    return (
        <View>
            <View style={[styles.calloutContainer, theme.shadowProperties]}>
                <Text style={styles.calloutTitle} numberOfLines={2}>
                    {report.address}
                </Text>
                <View style={[styles.calloutSubContainer, { justifyContent: "space-between" }]}>
                    <View style={styles.calloutSubContainer}>
                        <TrashbinIcon fill={theme.colors.primary3} width={18} height={18} />
                        <Text style={styles.calloutSubtitleTrashPoint}>
                            {GetRatingsAverage(report)}
                        </Text>
                        <Text style={styles.calloutInfo}>
                            {` (${totalRatings})`}
                        </Text>
                    </View>
                    <Text style={styles.calloutInfo}>
                        {`${Math.floor(userDistanceFromFocus)}${measureUnit}`}
                    </Text>
                </View>
                <View style={styles.triangle} />
                <View style={styles.calloutFooter} />
            </View>
            <View style={{ height: triangleSize }} />
        </View>
    )
}