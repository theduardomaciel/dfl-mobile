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
    description?: string;
    button?: boolean;
    toggleModal: () => void;
    children?: React.ReactNode;
}

export function ModalBase({ title, description, button, toggleModal, children, ...rest }: Props) {
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
                {
                    !button && <TextButton title="X" buttonStyle={styles.closeButton} onPress={toggleModal} />
                }
                {
                    description ? <Text style={styles.description}>{description}</Text> : null
                }
                {children}
                {
                    button && <TextButton title="VOLTAR" buttonStyle={styles.largeCloseButton} onPress={toggleModal} />
                }
            </View>
        </Modal>
    )
}