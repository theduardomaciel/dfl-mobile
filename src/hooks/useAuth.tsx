import React, { createContext, useContext, useEffect, useState, SetStateAction } from "react";

import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId: '867322063173-u3jns36k76voo7tuv2cv20s0lhuh1i82.apps.googleusercontent.com',
    forceCodeForRefreshToken: true,
    offlineAccess: true,
    scopes: [
        'https://www.googleapis.com/auth/user.gender.read',
        'https://www.googleapis.com/auth/user.birthday.read'
    ]
});

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from "expo-splash-screen";

import { api } from "../utils/api";
import { Profile, Report, User } from "../@types/application";

const SCOPE = "read:user";

const USER_STORAGE = "@dfl:user";
const TOKEN_STORAGE = "@dfl:token";
export const REPORTS_STORAGE = "@dfl:reports";
export const LOCATION_STORAGE = "@dfl:location";

type AuthContextData = {
    user: User | null;
    isSigningIn: boolean;
    hasAppPermissions: boolean;
    setHasAppPermissions: (state: boolean) => Promise<void>;
    signIn: () => Promise<string>;
    signOut: () => Promise<void>;
    updateReports: () => Promise<boolean | string>;
    updateProfile: (updatedProfileObject?) => Promise<void>;
    updateReport: (actualObject?, updatedObject?, updatedElementKey?) => Promise<Report>;
}

type AuthProviderProps = {
    children: React.ReactNode;
}

type AuthResponse = {
    token: string;
    user: User;
}

export const AuthContext = createContext({} as AuthContextData)

import * as Location from "expo-location"

import { check, RESULTS } from 'react-native-permissions';

import { locationPermission } from "../utils/permissionsToCheck";
import { GetReportsInLocation } from "../utils/functions/GetReportsInLocation";

function AuthProvider({ children }: AuthProviderProps) {
    const [isSigningIn, setIsSigningIn] = useState(true)
    const [hasAppPermissions, setHasAppPermissionsState] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    async function signIn() {
        setIsSigningIn(true)
        setHasAppPermissions(false)
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        try {
            const userInfo = await GoogleSignin.signIn();
            if (userInfo) {
                const userInfoWithScopes = await GoogleSignin.addScopes({
                    scopes: [
                        'https://www.googleapis.com/auth/user.gender.read',
                        'https://www.googleapis.com/auth/user.birthday.read'
                    ],
                });
                const tokens = await GoogleSignin.getTokens();
                // Chamar o backend com o usuário e o access_token
                try {
                    console.log("Checando dados no servidor...")
                    const authResponse = await api.post("/authenticate", { user_info: userInfoWithScopes.user, access_token: tokens.accessToken })
                    const authResponseData = authResponse.data as AuthResponse;

                    const responseUser = authResponseData.user
                    const responseToken = authResponseData.token

                    console.log("Dados obtidos com sucesso!", responseToken)
                    api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;

                    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(responseUser));
                    await AsyncStorage.setItem(TOKEN_STORAGE, responseToken);

                    setUser(responseUser);
                    console.log(`Usuário autenticou-se no aplicativo com sucesso!`);

                    setIsSigningIn(false)
                    const reportsResponse = await updateReports()
                    if (reportsResponse === true) {
                        return "success"
                    } else {
                        return "permission_lack"
                    }
                } catch (error) {
                    setIsSigningIn(false)
                    return error.toString()
                }
            } else {
                setIsSigningIn(false)
                return "[Error]: Os dados da conta do Google fornecida não foram encontrados."
            }
        } catch (error) {
            setIsSigningIn(false)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("Usuário cancelou o processo de login.");
                return "cancelled"
            } else if (error.code === statusCodes.IN_PROGRESS) {
                return `Um processo de login já está em execução.`
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                return `Os serviços da Google Play estão desatualizados ou indisponíveis em seu dispositivo.`
            } else {
                return error.toString()
            }
        }
    }

    async function signOut() {
        console.log("Des-logando usuário de sua conta.")
        try {
            await GoogleSignin.signOut();
            await AsyncStorage.removeItem(USER_STORAGE);
            await AsyncStorage.removeItem(TOKEN_STORAGE);
            setUser(null)
        } catch (error) {
            console.error(error);
        }
    }

    async function updateReports() {
        const result = await check(locationPermission)
        if (result === RESULTS.GRANTED) {
            setHasAppPermissionsState(true)
        } else {
            return false
        }

        const userLocation = await Location.getCurrentPositionAsync()
        if (userLocation) {
            const result = await Location.reverseGeocodeAsync({ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude });
            const location = result[0]
            const state = location.city ? location.city.replace(/ /g, '') : location.region.replace(/ /g, '');
            const reports = await GetReportsInLocation(state, true)
            console.warn(reports)
            if (reports) {
                await AsyncStorage.setItem(REPORTS_STORAGE, JSON.stringify(reports))
                await AsyncStorage.setItem(LOCATION_STORAGE, JSON.stringify(location))
                console.log("Os relatórios da cidade do usuário foram atualizados na aplicação.")
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    async function updateProfile(updatedProfileObject) {
        let updatedUser = null;
        let updatedProfile = updatedProfileObject || undefined
        if (updatedProfile === undefined) {
            console.log("Objeto do perfil do usuário atualizado não definido, atualizando via rede...")
            const readResponse = await api.get(`/profile/${user.profile.id}`)
            if (readResponse) {
                let userCopy = user;
                userCopy.profile = readResponse.data as Profile;
                updatedUser = userCopy
            }
        } else if (user && updatedProfile) {
            let userCopy = user;
            userCopy.profile = updatedProfileObject
            updatedUser = userCopy
        }
        if (updatedUser !== null) {
            await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(updatedUser));
            setUser(updatedUser);
            console.log("Objeto do usuário atualizado com sucesso!")
        } else {
            console.log("Erro ao atualizar objeto do usuário.")
        }
    }

    async function updateReport(actualObject, updatedObject, updatedElementKey) {
        let updatedReport = updatedObject || undefined
        if (actualObject && updatedElementKey) {
            let reportCopy = actualObject;
            reportCopy[updatedElementKey] = updatedObject
            updatedReport = reportCopy
        }
        if (updatedReport !== null) {
            console.log("Objeto do relatório atualizado com sucesso!")
            return updatedReport;
        } else {
            console.log("Erro ao atualizar objeto do relatório.")
        }
    }

    async function loadUserStorageData() {
        const userStorage = await AsyncStorage.getItem(USER_STORAGE);
        const parsedUser = JSON.parse(userStorage)
        const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

        if (userStorage && tokenStorage) {
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
            setUser(parsedUser);
            console.log("Usuário logado com sucesso!", tokenStorage)
        } else {
            // O usuário não está logado, podemos exibir a tela de onboarding
            SplashScreen.hideAsync();
        }
        setIsSigningIn(false);
    }

    useEffect(() => {
        loadUserStorageData()
    }, [])

    async function setHasAppPermissions(state: boolean) {
        await setHasAppPermissionsState(state)
    }

    return (
        <AuthContext.Provider value={{
            signIn,
            signOut,
            updateReports,
            updateProfile,
            updateReport,
            setHasAppPermissions,
            user,
            hasAppPermissions,
            isSigningIn,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth }