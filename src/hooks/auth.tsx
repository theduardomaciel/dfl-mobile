import React, { createContext, useContext, useState, useEffect } from "react";

import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId: '867322063173-idupsd05i0n5hi8k8ae2iamealrksu3u.apps.googleusercontent.com',
    offlineAccess: true
});

import AsyncStorage from "@react-native-async-storage/async-storage";

const SCOPE = "read:user";
const USER_STORAGE = "@dfl:user";
const TOKEN_STORAGE = "@dfl:token";

type User = {
    email: string;
    id: string;
    givenName: string;
    familyName: string;
    photo: string;
    name: string;
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
                setUser(userInfo.user)
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
                return console.log(error)
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
            const currentUser = await GoogleSignin.getCurrentUser();
            if (currentUser && currentUser.idToken) {
                setUser(currentUser.user)
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