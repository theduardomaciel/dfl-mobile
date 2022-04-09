import React, { createContext, useContext, useState, useEffect } from "react";

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
import { api } from "../utils/api";
import { Report, User } from "../@types/application";

const SCOPE = "read:user";
const USER_STORAGE = "@dfl:user";
const TOKEN_STORAGE = "@dfl:token";

type AuthContextData = {
    user: User | null;
    isSigningIn: boolean;
    creatingAccount: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
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
                    const authResponseData = authResponse.data as AuthResponse;

                    const responseUser = authResponseData.user
                    const responseToken = authResponseData.token

                    console.log("Dados obtidos com sucesso!")
                    api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;

                    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(responseUser));
                    await AsyncStorage.setItem(TOKEN_STORAGE, responseToken);

                    setUser(user);
                    console.log(`Usuário autenticou-se no aplicativo com sucesso!`);
                } catch (error) {
                    console.log(error)
                    setIsSigningIn(false)
                    return error
                }
            } else {
                console.log("O usuário não foi encontrado.")
                setIsSigningIn(false)
                return "O usuário não foi encontrado."
            }
            setIsSigningIn(false)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("Usuário cancelou o processo de login.");
                setIsSigningIn(false)
                return "cancelled"
            } else if (error.code === statusCodes.IN_PROGRESS) {
                setIsSigningIn(false)
                return console.log("Um processo de login já está em execução.");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setIsSigningIn(false)
                return console.log("Os serviços da Google Play estão desatualizados ou indisponíveis.");
            } else {
                setIsSigningIn(false)
                return console.log(error)
            }
        }
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
            updateReport,
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