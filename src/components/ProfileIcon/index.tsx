import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Modal from "react-native-modal";

import { styles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../global/styles/theme';

type Props = {
    uri: string;
    openConfig?: boolean;
}

export function ProfileIcon({ uri, openConfig }: Props) {
    const [modalOpen, setModalOpen] = useState(false)
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={() => {
                openConfig ? setModalOpen(true) : navigation.navigate("Conta")
            }}
        >
            <Image
                style={styles.logo}
                source={{
                    uri: uri,
                }}
            />
            {
                modalOpen &&
                <Modal
                    style={{ margin: 0, alignItems: "center", justifyContent: "flex-end" }}
                    isVisible={modalOpen}
                    deviceHeight={1920}
                    statusBarTranslucent={true}
                    backdropTransitionOutTiming={0}
                    hideModalContentWhileAnimating
                    animationOut={"slideOutDown"}
                    onSwipeComplete={() => setModalOpen(false)}
                    swipeDirection="down"
                >
                    <View style={styles.modalContainer}>
                        <LinearGradient
                            colors={[theme.colors.primary2, theme.colors.primary3]}
                            style={styles.headerGradient}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                        >
                            <Text style={styles.modalTitle}>Nome do Usuário</Text>
                            <Text style={styles.modalSubtitle}>emaildousuario@email.com</Text>
                        </LinearGradient>

                        <View style={styles.options}>

                        </View>
                    </View>
                </Modal>
            }
        </TouchableOpacity>
    );
}