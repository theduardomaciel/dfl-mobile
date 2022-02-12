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

import { useAuth } from '../../hooks/auth';
import { AccordionOptions } from "../AccordionOptions"

type Props = {
    uri: string;
    openConfig?: boolean;
}

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { TextForm } from '../TextForm';
import { TextButton } from '../TextButton';

export function ProfileIcon({ uri, openConfig }: Props) {
    const { user, signOut } = useAuth();

    const ProfileComponents = <View style={{ flex: 1, width: "100%" }}>
        <TextForm title='Nome de Usuário' style={{ height: 55 }} titleStyle={{ color: theme.colors.secondary1, fontFamily: theme.fonts.section400, fontSize: 14 }} textInputProps={{ placeholder: user.first_name }} />
        <TextButton title='Alterar nome de usuário' buttonStyle={{ backgroundColor: theme.colors.primary1, height: 35, marginTop: 10, width: "100%" }} />
    </View>

    const CONFIG_BUTTONS = [
        {
            id: "0",
            title: "Perfil",
            description: "como a comunidade lhe vê",
            icon: <Ionicons name="person" size={48} color={theme.colors.primary1} />,
            components: ProfileComponents,
            onPress: () => { }
        },
        {
            id: "1",
            title: "Conta",
            description: "configurações",
            icon: <Ionicons name="settings" size={48} color={theme.colors.primary1} />,
            onPress: () => { }
        },
        {
            id: "2",
            title: "Log-out",
            description: "nos vemos em breve!",
            icon: <MaterialIcons name="logout" size={48} color={theme.colors.primary1} />,
            onPress: signOut
        },
    ]

    const [modalVisible, setModalVisible] = useState(false)
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
            <View style={styles.logo}>
                <Image
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
            </Modal>
        </TouchableOpacity>
    );
}