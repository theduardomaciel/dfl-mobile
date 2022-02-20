import React, { useState } from 'react'
import { View, Text, KeyboardAvoidingView } from 'react-native'
import Modal from 'react-native-modal'

import Svg from "../../assets/onboarding/onboarding_5.svg"
import Svg2 from "../../assets/onboarding/onboarding_1.svg"

import { DefaultCityPicker } from '../ProfilePickers/DefaultCity'
import { UsernamePicker } from '../ProfilePickers/Username'
import { TextButton } from '../TextButton'

import { styles } from './styles'

import { api } from "../../services/api";
import { useAuth } from '../../hooks/auth'

type CustomModalProps = {
    isVisible: boolean;
    onBackdropPress?: () => void;
}

type Props = CustomModalProps & {
    toggleModal: () => void;
    isSecond?: boolean;
    secondToogleModal?: () => void;
}

/* type Profile = {
    username: string;
    defaultCity: string;
    level: number;
} */

export function ProfileModal({ toggleModal, isSecond, secondToogleModal, ...rest }: Props) {
    const { user, updateUser } = useAuth();

    const [username, setUsername] = useState("");
    const [defaultCity, setDefaultCity] = useState("Cidade não reconhecida");
    const handleDefaultCityPicker = (selectedValue) => {
        setDefaultCity(selectedValue)
        console.log(selectedValue)
    }

    const [loading, setLoading] = useState(false)
    async function CreateProfile() {
        setLoading(true)
        console.log("Nome de Usuário: ", username)
        console.log("Cidade: ", defaultCity)
        try {
            await api.post("/profile/create", { user: user, username: username, defaultCity: defaultCity })
            await updateUser();
            console.log(user)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
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
            await CreateProfile();
            toggleModal()
        }} />
    </KeyboardAvoidingView>

    return (
        <Modal
            statusBarTranslucent={true}
            deviceHeight={1920}
            style={{ alignItems: "center" }}
            hideModalContentWhileAnimating
            animationInTiming={1500}
            animationIn={"fadeInLeft"}
            animationOut={"fadeOutRight"}
            animationOutTiming={750}
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
                        <DefaultCityPicker onSelectOption={handleDefaultCityPicker} />
                        <TextButton title="PRÓXIMO" buttonStyle={styles.actionButton} textStyle={{ fontSize: 12 }} onPress={() => {
                            toggleModal()
                            if (secondToogleModal) { secondToogleModal() }
                        }} />
                    </KeyboardAvoidingView>
            }

        </Modal>
    )
}