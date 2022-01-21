import React, { useState } from "react";
import { View, Text, ScrollView, Image, StatusBar, Pressable, Button } from "react-native";
import Modal from "react-native-modal"

import { BottomBar } from "../../components/BottomBar";

//import MapView from "react-native-maps";

import { ProfileIcon } from "../../components/ProfileIcon";
import { SectionTitle } from "../../components/SectionTitle";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

import { Entypo } from '@expo/vector-icons';
import { TextButton } from "../../components/TextButton";
import { ModalBase } from "../../components/ModalBase";

export function Community() {
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    /* const ChangeCity_Modal = () => {
        return (
            
    }
 */
    return (
        <View style={styles.container}>
            <ModalBase
                title="Alterar cidade padrão"
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                toggleModal={() => { setModalVisible(false) }}
            >
                <Text>Essa é a descrição do modal.</Text>
                <TextButton title="ALTERAR CIDADE" buttonStyle={{ height: 40, width: 180, backgroundColor: theme.colors.primary1, borderRadius: 25 }} />
            </ModalBase>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <View style={styles.header}>
                <Text style={styles.title}>
                    Comunidade
                </Text>
            </View>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} >
                <SectionTitle title="Sua Cidade" info="212 usuários" />
                <View style={styles.mapView}>

                </View>
                <BottomBar
                    element={
                        <Pressable style={styles.button} onPress={toggleModal}>
                            <Text style={styles.info}>Maceió</Text>
                            <Entypo name="chevron-small-down" size={22} color="white" />
                        </Pressable>
                    }
                />

                <SectionTitle title="Enquetes" info="termina em 12h31m" />
                <View style={elements.subContainerWhite}>

                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}