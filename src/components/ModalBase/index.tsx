import React from 'react'
import { View, Text, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native'
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
    showCloseButtom?: boolean;
    style?: ViewStyle;
    descriptionStyle?: TextStyle;
    toggleModal: () => void;
    children?: React.ReactNode;
}

export function ModalBase({ title, description, button, showCloseButtom, toggleModal, children, style, descriptionStyle, ...rest }: Props) {
    return (
        <Modal
            statusBarTranslucent={true}
            deviceHeight={1920}
            style={{ alignItems: "center" }}
            animationIn={"fadeInUp"}
            backdropTransitionOutTiming={0}
            {...rest}
        >
            <View style={style ? [styles.modal, style] : styles.modal}>
                <Text style={styles.title}>
                    {title}
                </Text>
                {
                    showCloseButtom && <TextButton title="X" buttonStyle={styles.closeButton} onPress={toggleModal} />
                }
                {
                    description ? <Text style={descriptionStyle ? [styles.description, descriptionStyle] : styles.description}>{description}</Text> : null
                }
                {children}
                {
                    button && <TextButton title="VOLTAR" buttonStyle={styles.largeCloseButton} onPress={toggleModal} />
                }
            </View>
        </Modal>
    )
}