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
import { api } from "../utils/api";

import { User } from "../@types/application";

const SCOPE = "read:user";
const USER_STORAGE = "@dfl:user";
const TOKEN_STORAGE = "@dfl:token";

type AuthContextData = {
    user: User | null;
    //reports: Array<Report> | null;
    isSigningIn: boolean;
    creatingAccount: boolean;
    //signIn: () => Promise<void>;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (updatedObject?, updatedElementKey?) => Promise<void>;
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
                // Chamar o backend com o usuário e o access_token
                try {
                    console.log("Checando dados no servidor...")
                    const authResponse = await api.post("/authenticate", { user_info: userInfoWithScopes, access_token: tokens.accessToken })
                    const { user, token } = authResponse.data as AuthResponse;

                    console.log("Dados obtidos com sucesso!")
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
                    await AsyncStorage.setItem(TOKEN_STORAGE, token);

                    setUser(user);
                    console.log(`Usuário ${token} com sucesso!`, user);
                } catch (error) {
                    setIsSigningIn(false)
                    console.log(error)
                    return error
                }
            } else {
                console.log("O usuário não foi encontrado.")
                return "O usuário não foi encontrado."
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("Usuário cancelou o processo de login.");
                setIsSigningIn(false)
                return "cancelled"
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
        if (updateUser !== null) {
            await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(updatedUser));
            setUser(updatedUser);
            console.log("Objeto do usuário atualizado com sucesso!")
        } else {
            console.log("Erro ao atualizar objeto do usuário.")
        }
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStorage = await AsyncStorage.getItem(USER_STORAGE);
            const parsedUser = JSON.parse(userStorage)
            const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

            if (userStorage && tokenStorage) {
                api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
                setUser(parsedUser);
                console.log("Usuário logado com sucesso!", tokenStorage)
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