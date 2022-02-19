import React from 'react'
import { View, Text, KeyboardAvoidingView } from 'react-native'
import Modal from 'react-native-modal'

import Svg from "../../assets/onboarding/onboarding_5.svg"
import Svg2 from "../../assets/onboarding/onboarding_1.svg"

import { DefaultCityPicker } from '../ProfilePickers/DefaultCity'
import { UsernamePicker } from '../ProfilePickers/Username'
import { TextButton } from '../TextButton'

import { styles } from './styles'

type CustomModalProps = {
    isVisible: boolean;
    onBackdropPress?: () => void;
}

type Props = CustomModalProps & {
    toggleModal: () => void;
    isSecond?: boolean;
    secondToogleModal?: () => void;
}

export function ProfileModal({ toggleModal, isSecond, secondToogleModal, ...rest }: Props) {
    const secondProfileModalContent = <KeyboardAvoidingView style={styles.modal}>
        <Text style={styles.title}>
            Participando da Comunidade
        </Text>
        <Text style={styles.description}>
            Como vai querer ser chamado?
            Selecione um nome de usuário que os outros usuários visualizarão em relatórios e comentários!
        </Text>
        <Svg2 width={300} />
        <UsernamePicker />
        <TextButton title="ENTRAR NA COMUNIDADE" buttonStyle={styles.actionButton} textStyle={{ fontSize: 12 }} onPress={() => {
            toggleModal()
        }} />
    </KeyboardAvoidingView>
    return (
        <Modal
            statusBarTranslucent={true}
            deviceHeight={1920}
            style={{ alignItems: "center" }}
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
                        <DefaultCityPicker />
                        <TextButton title="PRÓXIMO" buttonStyle={styles.actionButton} textStyle={{ fontSize: 12 }} onPress={() => {
                            toggleModal()
                            if (secondToogleModal) { secondToogleModal() }
                        }} />
                    </KeyboardAvoidingView>
            }

        </Modal>
    )
}