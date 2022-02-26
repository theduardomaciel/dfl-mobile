import React, { useEffect, useState } from "react";
import { View, StatusBar, Text, Image, useWindowDimensions, ScrollView, Pressable, Platform, UIManager, LayoutAnimation } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";
import { MaterialIcons, Entypo } from "@expo/vector-icons"
import { SectionTitle } from "../../components/SectionTitle";
import { BottomBar } from "../../components/BottomBar";
import { TextButton } from "../../components/TextButton";
import { ModalBase } from "../../components/ModalBase";
import { TagsSelector } from "../../components/TagsSelector";
import { RectButton } from "react-native-gesture-handler";
import { LoadingScreen } from "../../components/LoadingScreen";
import { api } from "../../services/api";
import { User } from "../../@types/application";
import { useAuth } from "../../hooks/useAuth";

type Report = {
    id: number,
    address: string,
    coordinates: Array<number>,
    image_url: string,
    image_deleteHash: string,
    tags: string,
    suggestion: string,
    hasTrashBins: boolean
    resolved: boolean;
}

type TagsType = {
    id: string;
    title: string;
}

export function Report({ route, navigation }) {
    const report = route.params.item as Report;

    const { updateUser } = useAuth();

    const latitude = typeof report.coordinates[0] === "string" ? parseFloat(report.coordinates[0]) : report.coordinates[0]
    const longitude = typeof report.coordinates[1] === "string" ? parseFloat(report.coordinates[1]) : report.coordinates[0]
    const reportRegion = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    }

    const suggestion = report.suggestion ? report.suggestion : "[nenhuma sugestão foi informada]"


    let groups = [];
    const tagGroups = JSON.parse(report.tags);
    const [tags, setTags] = useState(Array)

    useEffect(() => {
        for (const [index, tagGroup] of Object.entries(tagGroups)) {
            for (const [key, tag] of Object.entries(tagGroup)) {
                if (tag.checked) {
                    groups.push(
                        <View key={tag.title} style={[styles.tag]}>
                            <Text style={styles.tagText}>{tag.title}</Text>
                            <MaterialIcons name="done" size={18} color="white" />
                        </View>
                    )
                }
            }
        }
        setTags(groups)
    }, [])

    const [isTagsModalVisible, setTagsModalVisible] = useState(false)
    const handleTagsChange = () => {

    }
    const tagsSelector = <TagsSelector style={{ height: "77%", width: "90%" }} onSelectTags={handleTagsChange} />

    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    const [isMenuVisible, setMenuVisible] = useState(false)
    const toggleMenu = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMenuVisible(!isMenuVisible)
    }

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    const deleteReport = async () => {
        setIsLoadingDelete(true)
        setDeleteModalVisible(false)
        setMenuVisible(false)

        try {
            const deleteResponse = await api.post("/report/delete", { report_id: report.id, image_deleteHash: report.image_deleteHash })
            const updatedUser = deleteResponse.data.user as User
            await updateUser(updatedUser)
        } catch (error) {
            console.log(error, "Não foi possível deletar o relatório selecionado")
        }

        setIsLoadingDelete(false)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ModalBase
                isVisible={isDeleteModalVisible}
                onBackdropPress={() => { }}
                title={"Tem certeza que quer deletar o relatório?"}
                description={"Essa ação não poderá ser desfeita."}
                children={
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <TextButton
                            title="CANCELAR"
                            buttonStyle={{ backgroundColor: theme.colors.red_light, paddingVertical: 10, paddingHorizontal: 15, marginRight: 10 }}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setDeleteModalVisible(false)
                                setMenuVisible(false)
                            }}
                        />
                        <TextButton
                            title="CONTINUAR"
                            buttonStyle={{ paddingVertical: 10, paddingHorizontal: 15 }}
                            onPress={deleteReport}
                        />
                    </View>
                }
                toggleModal={() => { setDeleteModalVisible(!isDeleteModalVisible) }}
            />

            <LinearGradient
                colors={[theme.colors.secondary1, theme.colors.primary1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <MaterialIcons name="arrow-back" size={24} color={"#FFFFFF"} onPress={() => { navigation.goBack() }} />
                    <Text style={styles.headerText}>
                        {report.address.length > 20 ? report.address.slice(0, 20) + "..." : report.address}
                    </Text>
                    <Entypo name="dots-three-vertical" size={18} color="#FFFFFF" onPress={toggleMenu} />
                    {
                        isMenuVisible ?
                            <RectButton
                                style={[styles.deletePrompt, { position: "absolute", right: 45, padding: 10 }]}
                                onPress={() => { setDeleteModalVisible(true) }}
                            >
                                <MaterialIcons name="delete" size={24} color={theme.colors.red} />
                                <Text style={styles.deletePromptText}>Excluir Relatório</Text>
                            </RectButton> : null
                    }

                </View>
            </LinearGradient>
            <View style={styles.image}>
                <Image style={{ flex: 1 }} source={{ uri: report.image_url }} />
                <LinearGradient
                    colors={[theme.colors.primary1, 'transparent']}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.imageGradient}
                >
                    <Text style={styles.suggestion}>
                        {suggestion}
                    </Text>
                </LinearGradient>
            </View>
            <SectionTitle title="Localização:" fontStyle={{ fontSize: 18 }} marginBottom={5} />
            <View style={{ width: "90%", height: 135 }}>
                <View style={[elements.mapView, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                    <MapView
                        style={{ flex: 1, borderRadius: 10, justifyContent: "center" }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={reportRegion}
                        region={reportRegion}
                    >
                        <Marker
                            key={0}
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }}
                            title={report.address}
                            description={suggestion}
                        />
                    </MapView>
                </View>
            </View>
            <BottomBar info={report.address} viewStyle={{ marginBottom: 15, width: "90%" }} />
            <View style={{ flexDirection: "row", width: "90%", justifyContent: "space-between" }}>
                <SectionTitle title="Detalhes:" fontStyle={{ fontSize: 18 }} marginBottom={5} />
                <TextButton title="+" onPress={() => { setTagsModalVisible(true) }} buttonStyle={{ paddingHorizontal: 8, paddingVertical: 1, borderRadius: 8, }} />
            </View>

            {
                isTagsModalVisible &&
                <ModalBase
                    isVisible={isTagsModalVisible}
                    title="Adicionar tags"
                    description="Adicione tags com informações relacionadas à situação do foco de lixo relatado."
                    children={tagsSelector}
                    onBackdropPress={() => { setTagsModalVisible(!isTagsModalVisible) }}
                    toggleModal={() => { setTagsModalVisible(!isTagsModalVisible) }}
                    style={{ height: 500, paddingVertical: 15 }}
                    descriptionStyle={{ textAlign: "left", fontSize: 14 }}
                    button
                />
            }

            <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center" }} showsVerticalScrollIndicator={false} style={[elements.subContainerWhite, styles.tagsContainer]}>
                <View style={styles.gridContainer}>
                    {tags}
                    <View style={{ width: "100%", height: 20 }} />
                </View>
            </ScrollView>
            <LinearGradient
                colors={report.resolved ? [theme.colors.secondary1, theme.colors.primary1] : [theme.colors.red_dark, theme.colors.red]}
                style={[styles.resolvedView, theme.shadowPropertiesLow]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            >
                <Text style={styles.resolvedText}>
                    {`Status: ${report.resolved ? "Resolvido" : "Não resolvido"}`}
                </Text>
            </LinearGradient>
            <Text style={styles.reportInfo}>
                {`ID do Relatório: ${report.id}`}
            </Text>
            {
                isLoadingDelete ? <LoadingScreen /> : null
            }
        </View>
    );
}