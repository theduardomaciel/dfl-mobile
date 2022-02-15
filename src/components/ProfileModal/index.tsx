import React, { useState } from 'react'
import { View, Text, GestureResponderEvent } from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'

import { TextButton } from '../TextButton'

import { styles } from './styles'

export function ProfileModal() {
    const [isVisible, setIsVisible] = useState(false)
    function toogleModal() {
        setIsVisible(!isVisible)
    }
    return (
        <Modal
            statusBarTranslucent={true}
            deviceHeight={1920}
            style={{ alignItems: "center" }}
            animationIn={"fadeInUp"}
            backdropTransitionOutTiming={0}
        >
            <View style={styles.modal}>
                <Text style={styles.title}>
                    Participando da Comunidade
                </Text>
                <Text style={styles.description}>
                    Para participar de uma comunidade composta de pessoas próximas a você, precisamos saber de que cidade você é!
                </Text>
                <TextButton title="CONTINUAR" buttonStyle={styles.actionButton} onPress={toogleModal} />
            </View>
        </Modal>
    )
}