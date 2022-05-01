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
import { Report, User } from "../@types/application";

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
    updateUser: (updatedObject?, updatedElementKey?) => Promise<void>;
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
            try {
                const reports = await GetReportsInLocation(state, true)
                if (reports) {
                    await AsyncStorage.setItem(REPORTS_STORAGE, JSON.stringify(reports))
                    await AsyncStorage.setItem(LOCATION_STORAGE, JSON.stringify(location))
                    console.log("Os relatórios da cidade do usuário foram atualizados na aplicação.")
                }
                return true
            } catch (error) {
                console.log(error)
                return "error"
            }
        }
    }

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
                    const authResponse = await api.post("/authenticate", { user_info: userInfoWithScopes, access_token: tokens.accessToken })
                    const authResponseData = authResponse.data as AuthResponse;

                    const responseUser = authResponseData.user
                    const responseToken = authResponseData.token

                    console.log("Dados obtidos com sucesso!")
                    api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;

                    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(responseUser));
                    await AsyncStorage.setItem(TOKEN_STORAGE, responseToken);

                    setUser(responseUser);
                    console.log(`Usuário autenticou-se no aplicativo com sucesso!`);

                    const reportsResponse = await updateReports()
                    setIsSigningIn(false)
                    if (reportsResponse === true) {
                        return "success"
                    } else {
                        return "permission_lack"
                    }
                } catch (error) {
                    setIsSigningIn(false)
                    console.log(error)
                    return "error"
                }
            } else {
                console.log("[Error]: Os dados da conta do Google fornecida não foram encontrados.")
                setIsSigningIn(false)
                return "error"
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("Usuário cancelou o processo de login.");
                setIsSigningIn(false)
                return "cancelled"
            } else if (error.code === statusCodes.IN_PROGRESS) {
                setIsSigningIn(false)
                console.log("Um processo de login já está em execução.");
                return "error"
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setIsSigningIn(false)
                console.log("Os serviços da Google Play estão desatualizados ou indisponíveis.");
                return "error"
            } else {
                setIsSigningIn(false)
                console.log(error)
                return "error"
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

    async function updateUser(updatedObject, updatedElementKey) {
        let updatedUser = updatedObject || undefined
        if (updatedUser === undefined) {
            console.log("Objeto do usuário atualizado não definido, atualizando via rede...")
            const readResponse = await api.post("/user", { user_id: user.id })
            if (readResponse) {
                console.log(readResponse.data)
                updatedUser = readResponse.data as User;
            }
        } else if (user && updatedElementKey) {
            let userCopy = Object.assign(user)
            userCopy[updatedElementKey] = updatedObject
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
            let reportCopy = Object.assign(actualObject)
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
            updateUser,
            updateReport,
            hasAppPermissions,
            setHasAppPermissions,
            user,
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