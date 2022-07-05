import 'react-native-gesture-handler';
import React from 'react';

import { Onboarding } from './screens/Onboarding';
import { MainScreen } from './screens/MainScreen';

import { Level } from "./screens/Level"
import { NewLevel } from "./screens/NewLevel"
import { ReportScreen } from "./screens/Report"
import { Search } from './screens/Reports/Search';

import { ConclusionScreen } from './screens/ConclusionScreen';

import { PermissionsExplanation } from './screens/PermissionScreens/PermissionsExplanation';
import { PermissionsRequest } from './screens/PermissionScreens/PermissionsRequest';

import { ReportScreen1 } from "./screens/ReportForm/Step1"
import { ReportScreen2 } from "./screens/ReportForm/Step2"
import { ReportScreen3 } from "./screens/ReportForm/Step3"

import { useAuth } from './hooks/useAuth';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function Routes() {
    const { user, hasAppPermissions } = useAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user && hasAppPermissions ? (
                <Stack.Group>
                    <Stack.Screen
                        name="Main"
                        component={MainScreen}
                    />
                    <Stack.Screen
                        name="Level"
                        component={Level}
                    />
                    <Stack.Screen
                        name="NewLevel"
                        component={NewLevel}
                        options={{ presentation: 'modal' }}
                    />
                    <Stack.Screen
                        name="Report"
                        component={ReportScreen}
                    />
                    <Stack.Screen
                        name="Search"
                        component={Search}
                    />
                </Stack.Group>
            ) :
                <Stack.Screen name="Onboarding" component={Onboarding} />
            }
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="PermissionsExplanation" component={PermissionsExplanation} />
                <Stack.Screen name="PermissionsRequest" component={PermissionsRequest} />

                <Stack.Screen name="ConclusionScreen" component={ConclusionScreen} />

                <Stack.Screen name="Step1" component={ReportScreen1} />
                <Stack.Screen name="Step2" component={ReportScreen2} />
                <Stack.Screen name="Step3" component={ReportScreen3} />
            </Stack.Group>
        </Stack.Navigator>
    )
}