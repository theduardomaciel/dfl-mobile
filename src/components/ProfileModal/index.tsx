import React, { useState } from 'react'
import { View, Text, KeyboardAvoidingView, Pressable } from 'react-native'
import Modal from 'react-native-modal'

import Svg from "../../assets/onboarding/onboarding_5.svg"
import Svg2 from "../../assets/onboarding/onboarding_1.svg"

import { DefaultCityPicker } from '../ProfilePickers/DefaultCity'
import { UsernamePicker } from '../ProfilePickers/Username'
import { TextButton } from '../TextButton'

import { styles } from './styles'
import { theme } from "../../global/styles/theme";

import { api } from "../../utils/api";
import { useAuth } from '../../hooks/useAuth'
import { Profile, User } from '../../@types/application'

import { AntDesign } from "@expo/vector-icons"

type CustomModalProps = {
    isVisible: boolean;
    onBackdropPress?: () => void;
}

type Props = CustomModalProps & {
    toggleModal: () => void;
    isSecond?: boolean;
    secondToggleModal?: () => void;
}

type ProfileResponse = {
    user: User;
    profile: Profile;
}

export function ProfileModal({ toggleModal, isSecond, secondToggleModal, ...rest }: Props) {
    const { user, updateUser } = useAuth();

    const [username, setUsername] = useState("");
    const [defaultCity, setDefaultCity] = useState("Maceió, AL - Brasil");

    const [loading, setLoading] = useState(false)
    async function CreateProfile() {
        setLoading(true)
        console.log("Nome de Usuário: ", username)
        console.log("Cidade: ", defaultCity)
        try {
            const profileResponse = await api.post("/profile/update", { user_id: user.id, username: username, defaultCity: defaultCity })
            setTimeout(() => {
                // O servidor não conseguiu responder a tempo/está desconectado | usuário está sem internet
                return "error"
            }, 10000);
            const response = profileResponse.data as ProfileResponse;
            console.log(response, response.user)
            if (response) {
                await updateUser(response.user);
                console.log(`Perfil do usuário criado com sucesso!`)
            }
        } catch (error) {
            console.log(error)
            return "error"
        }
    }

    const secondProfileModalContent = <KeyboardAvoidingView style={styles.modal}>
        <Text style={styles.title}>
            Participando da Comunidade
        </Text>
        <Text style={styles.description}>
            Como vai querer ser chamado?
            Selecione um nome de usuário que os outros usuários visualizarão em seus relatórios e comentários!
        </Text>
        <Svg2 width={300} />
        <UsernamePicker usernameState={setUsername} />
        <TextButton isLoading={loading} title="ENTRAR NA COMUNIDADE" buttonStyle={styles.actionButton} textStyle={{ fontSize: 12 }} onPress={async () => {
            const result = await CreateProfile();
            if (result === "error") {
                return setLoading(false);
            }
            toggleModal()
        }} />
        <AntDesign
            style={{ position: "absolute", top: -50, left: 0, backgroundColor: theme.colors.primary3, padding: 5, borderRadius: 15 }}
            name="arrowleft" size={24}
            color="white"
        />
    </KeyboardAvoidingView>

    return (
        <Modal
            statusBarTranslucent={true}
            deviceHeight={1920}
            style={{ alignItems: "center", flex: 1 }}
            animationIn={"fadeInLeft"}
            animationOut={"fadeOutLeft"}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            backdropTransitionOutTiming={0}
            {...rest}
        >
            {
                isSecond ? secondProfileModalContent
                    :
                    <KeyboardAvoidingView style={styles.modal}>
                        <Text style={styles.title}>
                            Participando da Comunidade
                        </Text>
                        <Text style={styles.description}>
                            Para participar de uma comunidade composta de pessoas próximas a você, precisamos saber de que cidade você é!
                        </Text>
                        <Svg width={300} />
                        <DefaultCityPicker state={defaultCity} setState={setDefaultCity} />
                        <TextButton title="PRÓXIMO" buttonStyle={styles.actionButton} textStyle={{ fontSize: 12 }} onPress={() => {
                            toggleModal()
                            secondToggleModal()
                        }} />
                    </KeyboardAvoidingView>
            }

        </Modal>
    )
}