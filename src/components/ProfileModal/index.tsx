import React, { useState } from 'react'
import { View, Text, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'

import Svg from "../../assets/onboarding/onboarding_5.svg"
import Svg2 from "../../assets/onboarding/onboarding_1.svg"

import { DefaultCityPicker } from '../ProfilePickers/DefaultCity'
import { MAX_USERNAME_CHARACTERS, MIN_USERNAME_CHARACTERS, UsernamePicker, verifyFormatting, verifyRange } from '../ProfilePickers/Username'
import { TextButton } from '../TextButton'

import { styles } from './styles'
import { theme } from "../../global/styles/theme";

import { api } from "../../utils/api";
import { useAuth } from '../../hooks/useAuth'
import { Profile, Report, User } from '../../@types/application'

import { AntDesign } from "@expo/vector-icons"
import { ModalBase } from '../ModalBase'

type CustomModalProps = {
    isVisible: boolean;
    onBackdropPress?: () => void;
}

type Props = CustomModalProps & {
    toggleModal: () => void;
    isSecond?: boolean;
    secondToggleModal?: () => void;
}

let defaultCity = "Maceió, Alagoas - Brasil";

export function ProfileModal({ toggleModal, isSecond, secondToggleModal, ...rest }: Props) {

    const { user, updateUser } = useAuth();
    const [username, setUsername] = useState("");

    const getCityPicked = async (scope, newRegion?) => {
        defaultCity = scope;
    }

    const [loading, setLoading] = useState(false)
    async function CreateProfile() {
        if (verifyFormatting(username) || verifyRange(username)) {
            toggleUsernameErrorModal()
        } else {
            setLoading(true)
            console.log("Nome de Usuário: ", username)
            console.log("Cidade: ", defaultCity)
            try {
                const profileResponse = await api.post("/profile/update", { profile_id: user.profile.id, username: username, defaultCity: defaultCity })
                const updatedProfile = profileResponse.data as Profile;
                if (updatedProfile) {
                    await updateUser(updatedProfile, "profile");
                    console.log(`Perfil do usuário criado com sucesso!`)
                }
                toggleModal()
            } catch (error) {
                console.log(error)
                return "error"
            }
            setLoading(false)
        }
    }

    const secondProfileModalContent =
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modal}>
                <Text style={styles.title}>
                    Participando da Comunidade
                </Text>
                <Text style={styles.description}>
                    Como vai querer ser chamado?
                    Selecione um nome de usuário que os outros usuários visualizarão em seus relatórios e comentários!
                </Text>
                <Svg2 width={300} />
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={200}>
                    <UsernamePicker usernameState={setUsername} />
                </KeyboardAvoidingView>
                <TextButton isLoading={loading} title="ENTRAR NA COMUNIDADE" buttonStyle={styles.actionButton} textStyle={{ fontSize: 12 }} onPress={async () => {
                    await CreateProfile();
                }} />
                <AntDesign
                    style={{ position: "absolute", top: -50, left: 0, backgroundColor: theme.colors.primary3, padding: 5, borderRadius: 15 }}
                    name="arrowleft"
                    size={24}
                    color="white"
                />
            </View>
        </TouchableWithoutFeedback>

    const [isInvalidUsernameModalVisible, setInvalidUsernameModalVisible] = useState(false)

    const toggleUsernameErrorModal = () => {
        setInvalidUsernameModalVisible(!isInvalidUsernameModalVisible)
    }

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
            {
                isSecond ? secondProfileModalContent
                    :
                    <View style={styles.modal}>
                        <Text style={styles.title}>
                            Participando da Comunidade
                        </Text>
                        <Text style={styles.description}>
                            Para participar de uma comunidade composta de pessoas próximas a você, precisamos saber de que cidade você é!
                        </Text>
                        <Svg width={300} />
                        <DefaultCityPicker changedScope={getCityPicked} />
                        <TextButton title="PRÓXIMO" buttonStyle={styles.actionButton} textStyle={{ fontSize: 12 }} onPress={() => {
                            toggleModal()
                            secondToggleModal()
                        }} />
                    </View>
            }
            <ModalBase
                isVisible={isInvalidUsernameModalVisible}
                onBackdropPress={toggleUsernameErrorModal}
                title={"Opa! Calma aí!"}
                showCloseButton
                description={`• Seu nome de usuário não pode conter letras maiúsculas ou espaços. ${verifyFormatting(username) ? "❌" : "✅"}\n• Seu nome de usuário deve ter no mínimo ${MIN_USERNAME_CHARACTERS} e no máximo ${MAX_USERNAME_CHARACTERS} caracteres. ${verifyRange(username) ? "❌" : "✅"}`}
                children={
                    <View style={{ alignItems: "center" }}>
                        <TextButton
                            title='ENTENDI'
                            onPress={toggleUsernameErrorModal}
                            buttonStyle={{ backgroundColor: theme.colors.primary1, marginTop: 10, paddingHorizontal: 15, paddingVertical: 7 }}
                        />
                    </View>
                }
                toggleModal={toggleUsernameErrorModal}
            />
        </Modal>
    )
}