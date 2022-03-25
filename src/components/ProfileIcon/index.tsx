import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
    Alert,
    FlatList,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Modal from "react-native-modal";
import Toast, { InfoToast } from "react-native-toast-message"

import { styles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../global/styles/theme';

import { useAuth } from '../../hooks/useAuth';
import { AccordionOptions } from "../AccordionOptions"

type Props = {
    uri: string;
    openConfig?: boolean;
}

export const toastConfig = {
    /*
      Overwrite 'info' type,
      by modifying the existing `InfoToast` component
    */
    info: (props) => (
        <InfoToast
            {...props}
            style={{ width: "95%", borderLeftColor: theme.colors.facebook_blue }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 14,
            }}
            text2Style={{
                fontSize: 12
            }}
        />
    ),
};

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { TextForm } from '../TextForm';
import { TextButton } from '../TextButton';
import { ModalBase } from '../ModalBase';
import { LoadingScreen } from '../LoadingScreen';

const MAX_USERNAME_CHARACTERS = 12

export function ProfileIcon({ uri, openConfig }: Props) {
    const { user, signOut } = useAuth();

    const [modalVisible, setModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [isChangeUsernameModalVisible, setChangeUsernameModalVisible] = useState(false);
    const [usernameText, setUserNameText] = useState("")
    const changeUsername = () => {
        console.log("Alterando nome do usuário...")
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 2000);
        setChangeUsernameModalVisible(false)
        setUserNameText("")
        setModalVisible(false)
    }

    const showToast = () => {
        Toast.show({
            type: "info",
            text1: "⚠️ Ou ou ou! Calma aí!",
            text2: `Seu nome de usuário só pode ter até ${MAX_USERNAME_CHARACTERS} caracteres!"`,
        })
    }

    const ProfileComponents = <View style={{ flex: 1, width: "100%" }}>
        <TextForm
            title='Nome de Usuário'
            customStyle={{ height: 55 }}
            titleStyle={{ color: theme.colors.secondary1, fontFamily: theme.fonts.section400, fontSize: 14 }}
            textInputProps={{
                autoCapitalize: "none",
                placeholder: user.profile ? `@${user.profile.username}` : user.first_name + user.last_name,
                onEndEditing: (text) => {
                    const username = text.nativeEvent.text.replace(/ /g, "").toLowerCase()
                    if (username.length > MAX_USERNAME_CHARACTERS) {
                        setUserNameText("")
                        showToast()
                    } else {
                        setUserNameText(username)
                    }
                },
            }}
        />
        <Text style={[styles.modalSubtitle, { color: theme.colors.secondary1 }]}>
            {`• Seu nome de usuário não pode conter letras maiúsculas ou espaços.\n• O máximo de caracteres permitido é ${MAX_USERNAME_CHARACTERS}`}
        </Text>
        <TextButton
            title='Alterar nome de usuário'
            onPress={() => {
                console.log(usernameText)
                if (usernameText.length > 0) {
                    setChangeUsernameModalVisible(true)
                }
            }}
            disabled={usernameText.length === 0 ? true : false}
            buttonStyle={{ backgroundColor: usernameText.length === 0 ? theme.colors.red_light : theme.colors.primary1, height: 35, marginTop: 10, width: "100%" }}
        />
    </View>

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
    const deleteAccount = () => {
        signOut()
    }

    const AccountComponents = <View style={{ flex: 1, width: "100%" }}>
        {/* <Text style={{ fontSize: 14, color: theme.colors.text1, backgroundColor: theme.colors.red_light, opacity: 0.8, padding: 5, marginTop: 5, fontFamily: theme.fonts.title700, borderRadius: 10 }}>
            ZONA DE PERIGO:
        </Text> */}
        <TextButton
            title='APAGAR CONTA'
            icon={<Ionicons name="trash" size={24} color={theme.colors.text1} />}
            onPress={() => { setDeleteModalVisible(true) }}
            buttonStyle={{ backgroundColor: theme.colors.red, height: 35, marginTop: 10, width: "100%" }}
        />

    </View>

    const CONFIG_BUTTONS = [
        {
            id: "0",
            title: "Perfil",
            description: "como a comunidade lhe vê",
            icon: <Ionicons name="person" size={48} color={theme.colors.primary1} />,
            components: ProfileComponents,
        },
        {
            id: "1",
            title: "Conta",
            description: "configurações",
            icon: <Ionicons name="settings" size={48} color={theme.colors.primary1} />,
            components: AccountComponents
        },
        {
            id: "2",
            title: "Log-out",
            description: "nos vemos em breve!",
            icon: <MaterialIcons name="logout" size={48} color={theme.colors.primary1} />,
            onPress: signOut
        },
    ]

    const navigation = useNavigation<any>();

    const Header = ({ item }) => (
        <View style={{ flexDirection: "row" }}>
            {item.icon}
            <View style={[styles.columnContainer, { marginLeft: 35 }]}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    const renderItem = ({ item }) => (
        item.components ? <AccordionOptions id={item.id} header={<Header item={item} />} accordionComponents={item.components} />
            : <AccordionOptions id={item.id} header={<Header item={item} />} onPress={item.onPress} />
    );

    const renderSeparator = () => (
        <View style={{
            backgroundColor: theme.colors.primary4,
            opacity: 0.35,
            flex: 1,
            height: 1,
        }}
        />
    );

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={() => {
                openConfig ? setModalVisible(true) : navigation.navigate("Conta")
            }}
        >
            <ModalBase
                isVisible={isDeleteModalVisible}
                onBackdropPress={() => { setDeleteModalVisible(!isDeleteModalVisible) }}
                title={"Tem certeza que quer excluir sua conta?"}
                showCloseButton
                description={
                    "Esta ação não poderá ser desfeita."}
                children={
                    <View style={{ alignItems: "center" }}>
                        <TextButton
                            title='EXCLUIR CONTA'
                            icon={<Ionicons name="trash" size={24} color={theme.colors.text1} />}
                            onPress={deleteAccount}
                            buttonStyle={{ backgroundColor: theme.colors.red, marginTop: 10, paddingHorizontal: 15, paddingVertical: 7 }}
                        />
                    </View>
                }
                toggleModal={() => { setDeleteModalVisible(!isDeleteModalVisible) }}
            />
            <ModalBase
                isVisible={isChangeUsernameModalVisible}
                onBackdropPress={() => { setChangeUsernameModalVisible(!isChangeUsernameModalVisible) }}
                title={"⚠️ Cuidado.\nVocê tem certeza?"}
                showCloseButton
                description={
                    `${user.profile.username} -> ${usernameText}.\nEssa ação é irreversível, e seu nome só poderá ser alterado novamente daqui a:\n1 mês.`
                }
                children={
                    <View style={{ alignItems: "center" }}>
                        <TextButton
                            title='ALTERAR NOME'
                            icon={<Ionicons name="at" size={24} color={theme.colors.text1} />}
                            onPress={changeUsername}
                            buttonStyle={{ backgroundColor: theme.colors.primary2, marginTop: 10, paddingHorizontal: 15, paddingVertical: 7 }}
                        />
                    </View>
                }
                toggleModal={() => { setDeleteModalVisible(!isDeleteModalVisible) }}
            />
            <View style={styles.logo}>
                <Image
                    progressiveRenderingEnabled
                    style={{ flex: 1 }}
                    source={{
                        uri: uri,
                    }}
                />
            </View>
            <Modal
                style={{ margin: 0, alignItems: "center", justifyContent: "flex-end" }}
                isVisible={modalVisible}
                deviceHeight={1920}
                statusBarTranslucent={true}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating
                animationOut={"slideOutDown"}
                onSwipeComplete={() => setModalVisible(false)}
                swipeDirection="down"
            >
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={[theme.colors.primary2, theme.colors.primary3]}
                        style={styles.headerGradient}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                    >
                        <Text style={styles.modalTitle}>{user ? user.first_name + " " + user.last_name : "nomedousuário"}</Text>
                        <Text style={styles.modalSubtitle}>{user ? user.email : "email@email.com"}</Text>
                    </LinearGradient>
                    <View style={styles.options}>
                        <Pressable style={styles.closeButton} onPress={() => { setModalVisible(false) }}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </Pressable>
                        <FlatList
                            style={{ width: "100%" }}
                            nestedScrollEnabled={true}
                            data={CONFIG_BUTTONS}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            ItemSeparatorComponent={renderSeparator}
                        />
                        {/* <ConfigOption id={2} title='Perfil' description='como a comunidade lhe vê' icon={
                            <Ionicons name="person" size={48} color={theme.colors.primary1} />
                        }
                        /> */}
                    </View>
                </View>
                <Toast
                    config={toastConfig}
                    visibilityTime={3000}
                    position={"bottom"}
                />
                {
                    isLoading ? <LoadingScreen /> : null
                }
            </Modal>
        </TouchableOpacity>
    );
}