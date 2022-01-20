import React from "react";
import { View, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { styles } from "./styles";
import { theme } from "../../global/styles/theme";

import { TextButton } from "../../components/TextButton";
import { TextForm } from "../../components/TextForm";

import { MaterialIcons } from '@expo/vector-icons';

export function SignUp() {
    const NameIcon = <MaterialIcons name="person-outline" size={24} color={theme.colors.secondary1} />
    const EmailIcon = <MaterialIcons name="mail-outline" size={24} color={theme.colors.secondary1} />
    const LockIcon = <MaterialIcons name="lock-outline" size={24} color={theme.colors.secondary1} />
    const HelpIcon = <MaterialIcons name="help-outline" size={24} color={theme.colors.secondary1} />

    const CircleIconUnselected = <MaterialIcons name="radio-button-off" size={24} color={theme.colors.secondary1} />
    const CircleIconSelected = <MaterialIcons name="radio-button-on" size={24} color={theme.colors.secondary1} />

    const ArrowDropdown = <MaterialIcons
        name="arrow-drop-down"
        size={24}
        color={theme.colors.secondary1}
    />
    const PasswordEye = <MaterialIcons
        name="remove-red-eye"
        size={24}
        color={theme.colors.secondary1}
    />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Você está a um passo de criar sua conta.</Text>
                <Text style={styles.subtitle}>Preencha as informações que restam e deixe o DFL fazer o resto.</Text>
            </View>
            <View style={styles.form}>
                <View style={styles.section}>
                    <TextForm
                        placeholder={"Nome"}
                        shadow
                        icon={NameIcon}
                        style={{ width: "49%" }}
                    />
                    <TextForm
                        placeholder={"Sobrenome"}
                        shadow
                        style={{ width: "49%" }}
                    />
                </View>
                <TextForm style={styles.section}
                    shadow
                    placeholder={"E-mail"}
                    icon={EmailIcon}
                />
                <TextForm style={styles.section}
                    shadow
                    placeholder={"Senha"}
                    icon={LockIcon}
                />
                <View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.passwordStrenghtText1}>
                            Força da Senha:
                        </Text>
                        <Text style={styles.passwordStrenghtText2}>
                            Média
                        </Text>
                    </View>
                    <View style={[styles.passwordStrenght, { backgroundColor: theme.colors.text1 }]} />
                    <View style={[styles.passwordStrenght, { backgroundColor: theme.colors.yellow, marginTop: -8, width: "75%", marginBottom: 15 }]} />
                </View>

                <Text style={styles.categoryTitle}>
                    Data de Nascimento
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
                    <TextForm
                        placeholder={"10"}
                        shadow
                        buttonIcon={ArrowDropdown}
                        keyboardType={"numeric"}
                        style={{ width: "32%", alignSelf: "center" }}
                    />
                    <TextForm
                        placeholder={"10"}
                        shadow
                        buttonIcon={ArrowDropdown}
                        keyboardType={"numeric"}
                        style={{ width: "32%" }}
                    />
                    <TextForm
                        placeholder={"10"}
                        shadow
                        buttonIcon={ArrowDropdown}
                        keyboardType={"numeric"}
                        style={{ width: "32%" }}
                    />
                </View>
                <Text style={styles.categoryTitle}>
                    Gênero
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TextButton
                        shadow
                        title={"Feminino"}
                        icon={CircleIconSelected}
                        textStyle={{ color: theme.colors.secondary1, fontFamily: theme.fonts.title700, fontSize: 14 }}
                        style={{ width: "32%", backgroundColor: theme.colors.text1, height: 34, borderRadius: 15, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 5 }}
                    />
                    <TextButton
                        shadow
                        title={"Masculino"}
                        icon={CircleIconUnselected}
                        textStyle={{ color: theme.colors.secondary1, fontFamily: theme.fonts.title700, fontSize: 14 }}
                        style={{ width: "32%", backgroundColor: theme.colors.text1, height: 34, borderRadius: 15, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 5 }}
                    />
                    <TextButton
                        shadow
                        title={"Outro"}
                        icon={CircleIconSelected}
                        textStyle={{ color: theme.colors.secondary1, fontFamily: theme.fonts.title700, fontSize: 14 }}
                        style={{ width: "32%", backgroundColor: theme.colors.text1, height: 34, borderRadius: 15, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 5 }}
                    />
                </View>
                <View style={{
                    marginTop: 15,
                    backgroundColor: theme.colors.secondary1,
                    opacity: 0.75,
                    height: 0.5,
                    width: "100%",
                }} />
            </View>
        </View>
    )
}