import React from 'react'
import { View, Text, GestureResponderEvent } from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'

import { TextButton } from '../TextButton'

import { styles } from './styles'

type CustomModalProps = {
    isVisible: boolean;
    onBackdropPress: () => void;
}

type Props = CustomModalProps & {
    title: string;
    toggleModal: any;
    children: React.ReactNode;
}

export function ModalBase({ title, toggleModal, children, ...rest }: Props) {
    return (
        <Modal
            statusBarTranslucent={true}
            deviceHeight={1920}
            style={{ alignItems: "center" }}
            animationIn={"fadeInUp"}
            backdropTransitionOutTiming={0}
            {...rest}
        >
            <View style={styles.modal}>
                <Text style={styles.title}>
                    {title}
                </Text>
                <TextButton title="X" buttonStyle={styles.closeButton} onPress={toggleModal} />
                {children}
            </View>
        </Modal>
    )
}