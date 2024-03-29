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
    signIn: () => Promise<string>;
    signOut: () => Promise<void>;
    updateReports: (updatedReport?: Report) => Promise<boolean | string>;
    updateProfile: (updatedProfileObject?) => Promise<void>;
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

function AuthProvider({ children }: AuthProviderProps) {
    const [isSigningIn, setIsSigningIn] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    async function signIn() {
        setIsSigningIn(true)
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

    async function updateReports(reportUpdated?: Report) {
        if (reportUpdated) {
            const reports = await AsyncStorage.getItem(REPORTS_STORAGE)
            if (reports) {
                const reportsArray = JSON.parse(reports)
                const newReports = reportsArray.filter(report => report.id !== reportUpdated.id) // removemos o relatório que queremos atualizar da array
                newReports.push(reportUpdated) // e adicionamos o novo no local
                await AsyncStorage.setItem(REPORTS_STORAGE, JSON.stringify(newReports))
                console.log("Os relatórios da cidade do usuário foram atualizados na aplicação com dados locais.")
                return true
            }
        } else {
            const result = await check(locationPermission)
            if (result !== RESULTS.GRANTED) {
                console.log("O usuário não autorizou a localização.")
                return "permission_lack"
            }
            const userLocation = await Location.getLastKnownPositionAsync()
            if (userLocation) {
                const result = await Location.reverseGeocodeAsync({ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude });
                const location = result[0]
                const state = location.region ? location.region.replace(/ /g, '') : location.region.replace(/ /g, '');
                try {
                    const reportsResponse = await api.get(`/report?location=${state}&includeInfo=true&approved=true`)
                    if (reportsResponse.status === 200) {
                        const reports = reportsResponse.data as Array<Report>
                        await AsyncStorage.setItem(REPORTS_STORAGE, JSON.stringify(reports))
                        await AsyncStorage.setItem(LOCATION_STORAGE, JSON.stringify(location))
                        console.log("Os relatórios da cidade do usuário foram atualizados na aplicação.")
                        return true
                    } else {
                        console.log(reportsResponse)
                        return false
                    }
                } catch (error) {
                    console.log(error)
                    return false
                }
            } else {
                return false
            }
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

    return (
        <AuthContext.Provider value={{
            signIn,
            signOut,
            updateReports,
            updateProfile,
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