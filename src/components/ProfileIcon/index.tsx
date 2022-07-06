import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
    FlatList,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Modal from "react-native-modal";

import { styles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../global/styles/theme';

import { useAuth } from '../../hooks/useAuth';
import { AccordionOptions } from "../AccordionOptions"

type Props = {
    uri: string;
    openConfig?: boolean;
}

import GearIcon from "../../assets/icons/gear_icon.svg"
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { TextForm } from '../TextForm';
import { TextButton } from '../TextButton';
import { ModalBase } from '../ModalBase';
import { LoadingScreen } from '../LoadingScreen';
import { MAX_USERNAME_CHARACTERS, MIN_USERNAME_CHARACTERS, verifyFormatting, verifyRange } from '../ProfileModal/Username';
import { api } from '../../utils/api';
import { Profile } from '../../@types/application';
import { UpdateNavigationBar } from '../../utils/functions/UpdateNavigationBar';

async function CheckIfUsernameIsAvailable(username) {
    const usersInLocationResults = await api.post("/profiles/search", {
        username: username
    })
    const profiles = usersInLocationResults.data as Array<Profile>;
    if (profiles.length > 0) {
        // Uma conta já possui o nome de usuário fornecido, retornando falso.
        return false
    } else return true;
}

export function ProfileIcon({ uri, openConfig }: Props) {
    const { user, updateProfile, signOut } = useAuth();

    const [modalVisible, setModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [isChangeUsernameModalVisible, setChangeUsernameModalVisible] = useState(false);
    const [usernameText, setUserNameText] = useState("")
    const changeUsername = async () => {
        console.log("Alterando nome do usuário...")
        setIsLoading(true)
        setChangeUsernameModalVisible(false)

        const profileResponse = await api.patch(`/profile/${user.profile.id}`, { username: usernameText })
        const updatedProfile = profileResponse.data as Profile;
        if (updatedProfile) {
            await updateProfile(updatedProfile)
            console.log(`Nome de perfil do usuário atualizado com sucesso!`)
        }

        setUserNameText("")
        setModalVisible(false)
    }

    const [canChangeUsername, setCanChangeUsername] = useState(false)
    const ProfileComponents = <View style={{ flex: 1, width: "100%" }}>
        <TextForm
            title='Nome de Usuário'
            customStyle={{ height: 55 }}
            titleStyle={{ color: theme.colors.secondary1, fontFamily: theme.fonts.section400, fontSize: 14 }}
            textInputProps={{
                autoCapitalize: "none",
                maxLength: MAX_USERNAME_CHARACTERS,
                placeholder: user.profile ? `@${user.profile.username}` : user.first_name + user.last_name,
                onChangeText: (text) => setUserNameText(text)
            }}
        />
        <Text style={[styles.modalSubtitle, { color: verifyFormatting(usernameText) ? theme.colors.red_light : theme.colors.secondary2 }]}>
            {`• Seu nome de usuário não pode conter espaços. ${verifyFormatting(usernameText) ? "❌" : "✅"}`}
        </Text>
        <Text style={[styles.modalSubtitle, { color: verifyRange(usernameText) ? theme.colors.red_light : theme.colors.secondary2 }]}>
            {`• Seu nome de usuário deve ter no mínimo ${MIN_USERNAME_CHARACTERS} e no máximo ${MAX_USERNAME_CHARACTERS} caracteres. ${verifyRange(usernameText) ? "❌" : "✅"}`}
        </Text>
        <TextButton
            title='Alterar nome de usuário'
            onPress={async () => {
                console.log(usernameText)
                if (usernameText.length > 0) {
                    setIsLoading(true)
                    const canChange = await CheckIfUsernameIsAvailable(usernameText)
                    setCanChangeUsername(canChange)
                    setIsLoading(false)
                    setChangeUsernameModalVisible(true)
                }
            }}
            disabled={verifyFormatting(usernameText) || verifyRange(usernameText) === true ? true : false}
            buttonStyle={{ backgroundColor: verifyFormatting(usernameText) || verifyRange(usernameText) === true ? theme.colors.red_light : theme.colors.primary1, height: 35, marginTop: 10, width: "100%" }}
        />
    </View>

    const [canDelete, setCanDelete] = useState(false)
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
    const deleteAccount = async () => {
        console.log("Apagando conta do usuário...")
        setIsLoading(true)

        const profileResponse = await api.post("/profile/update", { profile_id: user.profile.id, username: "", defaultCity: "" })
        if (profileResponse) {
            signOut()
        }

        setDeleteModalVisible(false)
    }

    const AccountComponents = <View style={{ flex: 1, width: "100%" }}>
        <Text style={{
            fontSize: 14,
            color: theme.colors.text1, backgroundColor: theme.colors.red,
            padding: 5,
            marginTop: 10,
            fontFamily: theme.fonts.title700,
            borderRadius: 10,
            textAlign: "center"
        }}>
            ⚠️  ZONA DE PERIGO:
        </Text>
        <TextButton
            title='EXCLUIR CONTA'
            icon={<Ionicons name="trash" size={24} color={theme.colors.text1} />}
            onPress={async () => {
                setDeleteModalVisible(true)
                let timer = 5
                const interval = setInterval(function () {
                    timer -= 1
                    if (timer === 0) {
                        //setTimer(5)
                        clearInterval(interval)
                    }
                }, 1000)
            }}
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
            onPress: () => {
                setIsLoading(true)
                signOut()
            }
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
        item.components ? <AccordionOptions id={item.id} customHeader={<Header item={item} />} accordionComponents={item.components} />
            : <AccordionOptions id={item.id} customHeader={<Header item={item} />} onPress={item.onPress} />
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

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={() => {
                openConfig ? openModal() : navigation.navigate("Conta")
            }}
        >
            <ModalBase
                isVisible={isDeleteModalVisible}
                onBackdropPress={() => {
                    setDeleteModalVisible(!isDeleteModalVisible)
                }}
                title={"Tem certeza que deseja excluir sua conta?"}
                showCloseButton
                description={
                    "Esta ação não poderá ser desfeita."}
                children={
                    <View style={{ alignItems: "center" }}>
                        <TextButton
                            title='EXCLUIR CONTA'
                            icon={<Ionicons name="trash" size={24} color={theme.colors.text1} />}
                            onPress={deleteAccount}
                            disabled={canDelete ? false : true}
                            buttonStyle={{ backgroundColor: canDelete ? theme.colors.red : theme.colors.gray_light, marginTop: 10, paddingHorizontal: 15, paddingVertical: 7 }}
                        />
                        {/* {
                            !canDelete &&
                            <Text style={styles.title}>{timer}</Text>
                        } */}
                    </View>
                }
                toggleModal={() => { setDeleteModalVisible(!isDeleteModalVisible) }}
            />
            <ModalBase
                isVisible={isChangeUsernameModalVisible}
                onBackdropPress={() => { setChangeUsernameModalVisible(!isChangeUsernameModalVisible) }}
                title={canChangeUsername ? "⚠️ Atenção! Você tem certeza?" : "Ops! Alguém foi mais rápido..."}
                showCloseButton
                description={
                    canChangeUsername ? `Você está alterando seu nome de ${user.profile.username} para ${usernameText}.` : `O nome de usuário ${usernameText} já está sendo utilizado por outra pessoa.\n\nQue tal tentar outro?`
                }
                children={
                    <View style={{ alignItems: "center" }}>
                        {
                            canChangeUsername ?
                                <TextButton
                                    title='ALTERAR NOME'
                                    icon={<Ionicons name="at" size={24} color={theme.colors.text1} />}
                                    onPress={changeUsername}
                                    buttonStyle={{ backgroundColor: theme.colors.primary2, marginTop: 10, paddingHorizontal: 15, paddingVertical: 7 }}
                                />
                                :
                                <TextButton
                                    title='VOLTAR'
                                    onPress={() => setChangeUsernameModalVisible(!isChangeUsernameModalVisible)}
                                    buttonStyle={{ backgroundColor: theme.colors.primary2, marginTop: 10, paddingHorizontal: 15, paddingVertical: 7 }}
                                />
                        }
                    </View>
                }
                toggleModal={() => setChangeUsernameModalVisible(!isChangeUsernameModalVisible)}
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
                coverScreen={true}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating
                animationOut={"slideOutDown"}
                onSwipeComplete={closeModal}
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
                        <Pressable style={styles.closeButton} onPress={closeModal}>
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
                {
                    isLoading ? <LoadingScreen /> : null
                }
            </Modal>
            {
                openConfig &&
                <View style={styles.configIconContainer}>
                    <GearIcon width={24} height={24} fill={theme.colors.secondary1} />
                </View>
            }
        </TouchableOpacity>
    );
}