import React from "react";
import { View, Text } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";

import { styles } from "./styles";
import Logo from "../../assets/Logo.svg"

import { theme } from "../../global/styles/theme";

import { TextButton } from "../../components/TextButton";
import { TextForm } from "../../components/TextForm";

import FacebookLogo from "../../assets/entreprises/facebook_logo.svg"
import GoogleLogo from "../../assets/entreprises/google_logo.svg"

export function PreSignUp() {
    const GoogleIcon = <GoogleLogo width={24} height={24} />
    const FacebookIcon = <FacebookLogo width={24} height={24} />
    return (
        <View style={styles.container}>
            <Logo style={styles.logo} width={325} height={165} />
            <View style={styles.form}>
                <Text style={styles.title}>Pronto para criar sua conta?</Text>
                <TextForm title={"Escolha um e-mail para a conta"} />
                <TextButton
                    title={"Continuar com e-mail"}
                    colors={["#26413C", "#346259"]}
                    shadow
                    buttonStyle={{ marginTop: 12, height: 45 }}
                />
                <Text style={styles.or}>
                    - ou -
                </Text>
                <View style={styles.socialContainer}>
                    <TextButton
                        title={"Continuar com Google"}
                        icon={GoogleIcon}
                        buttonStyle={{ height: 42, width: "49%", backgroundColor: theme.colors.text1 }}
                        textStyle={{ fontSize: 12, color: theme.colors.grey }}
                    />
                    <TextButton
                        title={"Continuar com Facebook"}
                        icon={FacebookIcon}
                        buttonStyle={{ height: 42, width: "49%", backgroundColor: theme.colors.text1 }}
                        textStyle={{ fontSize: 10, color: theme.colors.blue }}
                    />
                </View>
                <TouchableOpacity>
                    <Text style={[styles.or, { height: 32 }]}>
                        Não tem uma conta? Cadastre-se aqui!
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}