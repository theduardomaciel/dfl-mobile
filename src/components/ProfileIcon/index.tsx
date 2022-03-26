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

import { styles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../global/styles/theme';

import { useAuth } from '../../hooks/useAuth';
import { AccordionOptions } from "../AccordionOptions"

type Props = {
    uri: string;
    openConfig?: boolean;
}

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { TextForm } from '../TextForm';
import { TextButton } from '../TextButton';
import { ModalBase } from '../ModalBase';
import { LoadingScreen } from '../LoadingScreen';

const MIN_USERNAME_CHARACTERS = 3;
const MAX_USERNAME_CHARACTERS = 12

export function ProfileIcon({ uri, openConfig }: Props) {
    const { user, signOut } = useAuth();

    const [modalVisible, setModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [isChangeUsernameModalVisible, setChangeUsernameModalVisible] = useState(false);
    const [usernameText, setUserNameText] = useState("OUT_OF_RANGE")
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

    const verifyRange = usernameText.length > MAX_USERNAME_CHARACTERS || usernameText.length < MIN_USERNAME_CHARACTERS
    const verifyFormatting = (usernameText.includes(" ") || usernameText.toLowerCase() !== usernameText)

    const ProfileComponents = <View style={{ flex: 1, width: "100%" }}>
        <TextForm
            title='Nome de Usuário'
            customStyle={{ height: 55 }}
            titleStyle={{ color: theme.colors.secondary1, fontFamily: theme.fonts.section400, fontSize: 14 }}
            textInputProps={{
                autoCapitalize: "none",
                placeholder: user.profile ? `@${user.profile.username}` : user.first_name + user.last_name,
                /* onEndEditing: (text) => {
                    const username = text.nativeEvent.text
                    if (username.length > MAX_USERNAME_CHARACTERS || username.length < MIN_USERNAME_CHARACTERS) {
                        setUserNameText("OUT_OF_RANGE")
                    } else if (username.includes(" ") || username.toLocaleLowerCase() !== username) {
                        setUserNameText("OUT_OF_FORMATTING")
                    } else {
                        setUserNameText(username)
                    }
                }, */
                onChangeText: (text) => setUserNameText(text)
            }}
        />

        {/* <Text style={[styles.modalSubtitle, { color: usernameText === "OUT_OF_FORMATTING" ? theme.colors.red_light : theme.colors.secondary2 }]}>
            {`• Seu nome de usuário não pode conter letras maiúsculas ou espaços. ${usernameText === "OUT_OF_FORMATTING" ? "❌" : "✅"}`}
        </Text>
        <Text style={[styles.modalSubtitle, { color: usernameText === "MAX_USERNAME_CHARACTERS" ? theme.colors.red_light : theme.colors.secondary2 }]}>
            {`• Seu nome de usuário deve ter no mínimo ${MIN_USERNAME_CHARACTERS} e no máximo ${MAX_USERNAME_CHARACTERS} caracteres. ${usernameText === "OUT_OF_RANGE" ? "❌" : "✅"}`}
        </Text> */}
        <Text style={[styles.modalSubtitle, { color: verifyFormatting ? theme.colors.red_light : theme.colors.secondary2 }]}>
            {`• Seu nome de usuário não pode conter letras maiúsculas ou espaços. ${verifyFormatting ? "❌" : "✅"}`}
        </Text>
        <Text style={[styles.modalSubtitle, { color: verifyRange ? theme.colors.red_light : theme.colors.secondary2 }]}>
            {`• Seu nome de usuário deve ter no mínimo ${MIN_USERNAME_CHARACTERS} e no máximo ${MAX_USERNAME_CHARACTERS} caracteres. ${verifyRange ? "❌" : "✅"}`}
        </Text>
        <TextButton
            title='Alterar nome de usuário'
            onPress={() => {
                console.log(usernameText)
                if (usernameText.length > 0) {
                    setChangeUsernameModalVisible(true)
                }
            }}
            disabled={verifyFormatting || verifyRange === true ? true : false}
            buttonStyle={{ backgroundColor: verifyFormatting || verifyRange === true ? theme.colors.red_light : theme.colors.primary1, height: 35, marginTop: 10, width: "100%" }}
        />
    </View>

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
    const [timer, setTimer] = useState(0)
    let counter = 5

    const deleteAccount = () => {
        console.log("Apagando conta do usuário...")
        setIsLoading(true)
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
                await setTimer(5)
                setDeleteModalVisible(true)
                const interval = setInterval(function () {
                    counter -= 1;
                    setTimer(counter)
                    if (counter === 0) {
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
                            disabled={timer === 0 ? false : true}
                            buttonStyle={{ backgroundColor: timer !== 0 ? theme.colors.gray_light : theme.colors.red, marginTop: 10, paddingHorizontal: 15, paddingVertical: 7 }}
                        />
                        <Text style={styles.title}>{timer}</Text>
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
                {
                    isLoading ? <LoadingScreen /> : null
                }
            </Modal>
        </TouchableOpacity>
    );
}