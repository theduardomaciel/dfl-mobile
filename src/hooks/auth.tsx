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

import AsyncStorage from "@react-native-async-storage/async-storage";

const SCOPE = "read:user";
const USER_STORAGE = "@dfl:user";
const TOKEN_STORAGE = "@dfl:token";

type User = {
    email: string;
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    image_url: string;
}

type AuthContextData = {
    user: User | null;
    isSigningIn: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
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

    async function signIn() {
        try {
            setIsSigningIn(true)
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();
            if (userInfo && userInfo.idToken) {
                //const { user, idToken } = userInfo;
                console.log("Usuário criado com sucesso!", userInfo.user);
                const userWithScopes = await GoogleSignin.addScopes({
                    scopes: [
                        'https://www.googleapis.com/auth/user.gender.read',
                        'https://www.googleapis.com/auth/user.birthday.read'
                    ],
                });
                //console.log("Com escopos: ", userWithScopes)
                const tokens = await GoogleSignin.getTokens();
                console.log(tokens)
                setUser({
                    email: userInfo.user.email,
                    id: userInfo.user.id,
                    name: userInfo.user.name,
                    first_name: userInfo.user.givenName,
                    last_name: userInfo.user.familyName,
                    image_url: userInfo.user.photo,
                })
                /* await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
                await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(userInfo.idToken)) */
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                return console.log("Usuário cancelou o processo de login.");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                return console.log("Um processo de login já está em execução.");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                return console.log("Os serviços da Google Play estão desatualizados ou indisponíveis.");
            } else {
                console.log(error)
                return console.log("erro de conexão")
            }
        } finally {
            setIsSigningIn(false)
        }
    }

    async function signOut() {
        console.log("Deslogando da conta.")
        try {
            await GoogleSignin.signOut();
            setUser(null)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadUserStorageData() {
            //const userStorage = await AsyncStorage.getItem(USER_STORAGE);
            //const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);
            const currentUser = await GoogleSignin.addScopes({
                scopes: [
                    'https://www.googleapis.com/auth/user.gender.read',
                    'https://www.googleapis.com/auth/user.birthday.read'
                ],
            });
            if (currentUser && currentUser.idToken) {
                setUser({
                    email: currentUser.user.email,
                    id: currentUser.user.id,
                    name: currentUser.user.name,
                    first_name: currentUser.user.givenName,
                    last_name: currentUser.user.familyName,
                    image_url: currentUser.user.photo,
                })
                console.log("Logando o usuário...")
            }
            setIsSigningIn(false);
        }
        loadUserStorageData();
    }, []);

    return (
        <AuthContext.Provider value={{
            signIn,
            signOut,
            user,
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