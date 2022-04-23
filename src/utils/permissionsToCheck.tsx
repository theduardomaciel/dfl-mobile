import { Platform } from "react-native";

import { PERMISSIONS } from 'react-native-permissions';

export const permissionsToCheck =
    Platform.OS === "android" ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE