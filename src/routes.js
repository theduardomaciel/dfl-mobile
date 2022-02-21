import 'react-native-gesture-handler';
import React from 'react';

import { Onboarding } from './screens/Onboarding';
import { MainScreen } from './screens/MainScreen';

import { Report } from "./screens/Report"

import { PermissionsExplanation } from './screens/PermissionScreens/PermissionsExplanation';
import { PermissionsResquest } from './screens/PermissionScreens/PermissionsRequest';

import { ReportScreen1 } from "./screens/ReportForm/Step1"
import { ReportScreen2 } from "./screens/ReportForm/Step2"
import { ReportScreen3 } from "./screens/ReportForm/Step3"

import { useAuth } from './hooks/auth';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function Routes() {
    const { user } = useAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ?
                <>
                    <Stack.Screen
                        name="Main"
                        component={MainScreen}
                        options={{ headerShown: false, presentation: "modal" }}
                    />
                    <Stack.Screen
                        name="Report"
                        component={Report}
                        options={{ headerShown: false }}
                    />
                    <Stack.Group screenOptions={{ presentation: 'modal' }}>
                        <Stack.Screen name="PerimissionsExplanation" component={PermissionsExplanation} />
                        <Stack.Screen name="PermissionsRequest" component={PermissionsResquest} />
                    </Stack.Group>
                    <Stack.Group screenOptions={{ presentation: 'modal' }}>
                        <Stack.Screen name="Step1" component={ReportScreen1} />
                        <Stack.Screen name="Step2" component={ReportScreen2} />
                        <Stack.Screen name="Step3" component={ReportScreen3} />
                    </Stack.Group>
                </>
                :
                <Stack.Screen name="Onboarding" component={Onboarding} />
            }
        </Stack.Navigator>
    )
}