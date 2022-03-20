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
    backButton?: boolean;
    showCloseButton?: boolean;
    style?: ViewStyle;
    descriptionStyle?: TextStyle;
    toggleModal: () => void;
    children?: React.ReactNode;
}

export function ModalBase({ title, description, backButton, showCloseButton, toggleModal, children, style, descriptionStyle, ...rest }: Props) {
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
                    description && <Text style={descriptionStyle ? [styles.description, descriptionStyle] : styles.description}>{description}</Text>
                }
                {children}
                {
                    backButton && <TextButton title="VOLTAR" buttonStyle={styles.largeCloseButton} onPress={toggleModal} />
                }
                {
                    showCloseButton && <TextButton title="X" buttonStyle={styles.closeButton} onPress={toggleModal} />
                }
            </View>
        </Modal>
    )
}