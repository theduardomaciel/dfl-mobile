import React, { useState } from 'react'
import { View, Text, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'

import Svg2 from "../../assets/onboarding/onboarding_1.svg"

import { MAX_USERNAME_CHARACTERS, MIN_USERNAME_CHARACTERS, UsernamePicker, verifyFormatting, verifyRange } from './Username'
import { TextButton } from '../TextButton'

import { styles } from './styles'
import { theme } from "../../global/styles/theme";

import { api } from "../../utils/api";
import { useAuth } from '../../hooks/useAuth'
import { Profile } from '../../@types/application'

import { AntDesign } from "@expo/vector-icons"
import { ModalBase } from '../ModalBase'

type CustomModalProps = {
    isVisible: boolean;
    onBackdropPress?: () => void;
}

type Props = CustomModalProps & {
    toggleModal: () => void;
}

export function ProfileModal({ toggleModal, ...rest }: Props) {

    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState("");

    const [loading, setLoading] = useState(false)
    async function CreateProfile() {
        if (verifyFormatting(username) || verifyRange(username)) {
            setInvalidUsernameModalMessage(`• Seu nome de usuário não pode conter letras maiúsculas ou espaços. ${verifyFormatting(username) ? "❌" : "✅"}\n• Seu nome de usuário deve ter no mínimo ${MIN_USERNAME_CHARACTERS} e no máximo ${MAX_USERNAME_CHARACTERS} caracteres. ${verifyRange(username) ? "❌" : "✅"}`)
        } else {
            setLoading(true)
            console.log("Nome de Usuário: ", username)
            try {
                const profileResponse = await api.patch(`/profile/${user.profile.id}`, { username: username })
                const updatedProfile = profileResponse.data as Profile;
                if (updatedProfile) {
                    await updateProfile(updatedProfile)
                    console.log(`Perfil do usuário criado com sucesso!`)
                    toggleModal()
                } else {
                    setInvalidUsernameModalMessage("O nome de usuário inserido já está em uso por outra pessoa :(")
                }
            } catch (error) {
                console.log(error)
                return "error"
            }
            setLoading(false)
        }
    }

    const [invalidUsernameModalMessage, setInvalidUsernameModalMessage] = useState(" ")
    const disableUsernameModal = () => setInvalidUsernameModalMessage(" ")

    return (
        <Modal
            statusBarTranslucent={true}
            deviceHeight={1920}
            animationIn={"fadeInLeft"}
            animationOut={"fadeOutLeft"}
            useNativeDriver={true}
            avoidKeyboard={true}
            useNativeDriverForBackdrop={true}
            backdropTransitionOutTiming={0}
            {...rest}
        >
            <View style={styles.modal}>
                <Text style={styles.title}>
                    Participando da Comunidade
                </Text>
                <Text style={styles.description}>
                    Como vai querer ser chamado?
                    Selecione um nome de usuário que os outros usuários visualizarão em seus relatórios e comentários!
                </Text>
                <Svg2 width={300} />
                {/* <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={200}> */}
                <UsernamePicker usernameState={setUsername} />
                {/* </KeyboardAvoidingView> */}
                <TextButton isLoading={loading} title="ENTRAR NA COMUNIDADE" buttonStyle={styles.actionButton} textStyle={{ fontSize: 12 }} onPress={async () => {
                    await CreateProfile();
                }} />
                {/* <AntDesign
                        style={{ position: "absolute", top: -50, left: 0, backgroundColor: theme.colors.primary3, padding: 5, borderRadius: 15 }}
                        name="arrowleft"
                        size={24}
                        color="white"
                    /> */}
                <ModalBase
                    isVisible={invalidUsernameModalMessage !== " "}
                    onBackdropPress={disableUsernameModal}
                    title={"Opa! Calma aí!"}
                    showCloseButton
                    description={invalidUsernameModalMessage}
                    children={
                        <View style={{ alignItems: "center" }}>
                            <TextButton
                                title='ENTENDI'
                                onPress={disableUsernameModal}
                                buttonStyle={{ backgroundColor: theme.colors.primary1, marginTop: 10, paddingHorizontal: 15, paddingVertical: 7 }}
                            />
                        </View>
                    }
                    toggleModal={disableUsernameModal}
                />
            </View>
        </Modal>
    )
}