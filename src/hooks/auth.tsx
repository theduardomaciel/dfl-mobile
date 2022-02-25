import React, { createContext, useContext, useState, useEffect } from "react";

import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId: '867322063173-idupsd05i0n5hi8k8ae2iamealrksu3u.apps.googleusercontent.com',
    forceCodeForRefreshToken: true,
    offlineAccess: true,
    scopes: [
        'https://www.googleapis.com/auth/user.gender.read',
        'https://www.googleapis.com/auth/user.birthday.read'
    ]
});

import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from "../services/api";

const SCOPE = "read:user";
const USER_STORAGE = "@dfl:user";

const TOKEN_STORAGE = "@dfl:token";

type Report = {
    id: number;
    address: string,
    coordinates: Array<number>,
    image_url: string,
    image_deleteHash: string,
    tags: string,
    suggestion: string,
    hasTrashbin: boolean,
    createdAt: string;
    solved: boolean;
}

type Profile = {
    username: string;
    defaultCity: string;
    level: number;
}

type User = {
    id: string;
    google_id: string;
    email: string;
    first_name: string;
    last_name: string;
    image_url: string;
    profile: Profile;
    reports: Array<Report>;
    createdAt: string;
}

type AuthContextData = {
    user: User | null;
    //reports: Array<Report> | null;
    isSigningIn: boolean;
    creatingAccount: boolean;
    //signIn: () => Promise<void>;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: () => Promise<void>;
}

type AuthProviderProps = {
    children: React.ReactNode;
}

type AuthResponse = {
    token: string;
    user: User;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
    const [isSigningIn, setIsSigningIn] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [creatingAccount, setCreatingAccount] = useState(false)

    async function signIn() {
        setCreatingAccount(true)
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
                // Chamar o backend com o usuário e o acess_token
                try {
                    console.log("e lá vamos nós 1")
                    const authResponse = await api.post("/authenticate", { user_info: userInfoWithScopes, access_token: tokens.accessToken })
                    console.log("e lá vamos nós 2")
                    const { user, token } = authResponse.data as AuthResponse;
                    console.log("e lá vamos nós 3", user, token)
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
                    await AsyncStorage.setItem(TOKEN_STORAGE, token);

                    setUser(user);
                    console.log(`Usuário ${token} com sucesso!`, user);
                } catch (error) {
                    setIsSigningIn(false)
                    return error
                }
            } else {
                console.log("O usuário não foi encontrado.")
                return "O usuário não foi encontrado."
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("Usuário cancelou o processo de login.");
                return setIsSigningIn(false)
            } else if (error.code === statusCodes.IN_PROGRESS) {
                return console.log("Um processo de login já está em execução.");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                return console.log("Os serviços da Google Play estão desatualizados ou indisponíveis.");
            } else {
                return console.log(error)
            }
        }
        setIsSigningIn(false)
    }

    async function signOut() {
        console.log("Deslogando usuário de sua conta.")
        try {
            await GoogleSignin.signOut();
            await AsyncStorage.removeItem(USER_STORAGE);
            await AsyncStorage.removeItem(TOKEN_STORAGE);
            setUser(null)
        } catch (error) {
            console.error(error);
        }
    }

    /* async function GetUserReports() {
        const reportsResponse = await api.post("/user/reports", { user_id: user.id });
        const updatedReports = reportsResponse.data as Array<Report>
        setReports(updatedReports)
    } */

    async function updateUser() {
        const readResponse = await api.post("/user", { user_id: user.id })
        const updatedUser = readResponse.data as User;

        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(updatedUser));

        setUser(updatedUser);
        console.log(`Usuário atualizado com sucesso!`);
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStorage = await AsyncStorage.getItem(USER_STORAGE);
            const parsedUser = JSON.parse(userStorage)
            const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

            if (userStorage && tokenStorage) {
                api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
                setUser(parsedUser);
                console.log("Usuário logado com sucesso!", userStorage)
            }

            setIsSigningIn(false);
        }
        loadUserStorageData();
    }, []);

    return (
        <AuthContext.Provider value={{
            signIn,
            signOut,
            updateUser,
            user,
            creatingAccount,
            isSigningIn
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