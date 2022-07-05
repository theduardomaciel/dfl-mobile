import React, { useEffect, useState } from "react";
import { View, StatusBar, Text, Image, useWindowDimensions, ScrollView, Platform, UIManager, LayoutAnimation } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { RectButton } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";
import { styles } from "./styles";

import { MaterialIcons, Entypo } from "@expo/vector-icons"

import { SectionTitle } from "../../components/SectionTitle";
import { BottomBar } from "../../components/BottomBar";
import { TextButton } from "../../components/TextButton";
import { ModalBase } from "../../components/ModalBase";
import { TagsSelector } from "../../components/TagsSelector";
import { LoadingScreen } from "../../components/LoadingScreen";

import TrashBinSVG from "../../assets/icons/trashbin.svg"

import { useAuth } from "../../hooks/useAuth";
import { api } from "../../utils/api";
import { Profile, Report } from "../../@types/application";
import { GetRatingsAverage } from "../Reports";
import { CommentsModal } from "../Reports/Comments/Modal";
import { UpdateNavigationBar } from "../../utils/functions/UpdateNavigationBar";

type TagsType = {
    id: string;
    title: string;
}

let counter = 0;

export function ReportScreen({ navigation, route }) {
    const report = route.params.item as Report;

    const { user, updateProfile } = useAuth();

    const latitude = parseFloat(report.coordinates[0])
    const longitude = parseFloat(report.coordinates[1])
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
        UpdateNavigationBar(null, true, null)
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
        if (report.comments === undefined) {
            report.comments = []
        }
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

    const animationPreset = LayoutAnimation.create(150, "easeInEaseOut", "opacity");

    const [isMenuVisible, setMenuVisible] = useState(false)
    const toggleMenu = () => {
        LayoutAnimation.configureNext(animationPreset);
        setMenuVisible(!isMenuVisible)
    }

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    const deleteReport = async () => {
        setIsLoadingDelete(true)
        setDeleteModalVisible(false)
        setMenuVisible(false)

        try {
            const response = await api.delete(`/report/${report.id}`)
            if (response.status === 200) {
                await updateProfile()
                navigation.navigate("Main", {
                    screen: "Conta",
                    params: { status: `success_${counter}` },
                });
                console.log("O relatório selecionado foi excluído com sucesso.")
            }
        } catch (error) {
            navigation.navigate("Main", {
                screen: "Conta",
                params: { status: `error_${counter}` },
            });
            console.log(error, "Não foi possível deletar o relatório selecionado")
        }
        counter += 1
    }

    const [isCommentsModalVisible, setCommentsModalVisible] = useState(false)
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ModalBase
                isVisible={isDeleteModalVisible}
                onBackdropPress={() => { }}
                title={"Tem certeza que quer deletar o relatório?"}
                description={"Essa ação não poderá ser desfeita."}
                dismissFunction={() => {
                    LayoutAnimation.configureNext(animationPreset);
                    setDeleteModalVisible(false)
                    setMenuVisible(false)
                }}
                actionFunction={deleteReport}
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
                    {
                        user.profile.id === report.profile_id &&
                        <Entypo name="dots-three-vertical" size={18} color="#FFFFFF" onPress={toggleMenu} />
                    }
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
                <Image style={{ flex: 1 }} source={{ uri: report.images_urls[0] }} />
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
            <SectionTitle title="Localização:" fontStyle={{ fontSize: 18 }} viewStyle={{ marginBottom: 5 }} />
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
                <SectionTitle title="Detalhes:" fontStyle={{ fontSize: 18 }} viewStyle={{ marginBottom: 5 }} />
                {/* <TextButton title="+" onPress={() => { setTagsModalVisible(true) }} buttonStyle={{ paddingHorizontal: 8, paddingVertical: 1, borderRadius: 8, }} /> */}
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
                    backButton
                />
            }

            <ScrollView showsVerticalScrollIndicator={false} style={[elements.subContainerWhite, styles.tagsContainer]} >
                {tags.length > 0 ?
                    <View style={styles.gridContainer}>
                        {tags}
                        <View style={{ width: "100%", height: 20 }} />
                    </View> :
                    <View>
                        <Text style={{ textAlign: "center", textAlignVertical: "center", fontFamily: theme.fonts.title600, height: "100%", fontSize: 18, color: theme.colors.secondary1, paddingHorizontal: 25 }}>
                            Nenhuma tag foi selecionada para esse relatório!
                        </Text>
                    </View>
                }
            </ScrollView>
            <View style={{ flexDirection: "row", marginTop: 15, width: "90%", justifyContent: "space-between" }}>
                <TextButton
                    title="Comentários"
                    icon={<MaterialIcons name="comment" size={28} color={theme.colors.text1} />}
                    buttonStyle={styles.commentButton}
                    onPress={() => {
                        setCommentsModalVisible(true)
                    }}
                />
                <View style={styles.ratingView}>
                    <TrashBinSVG height={28} width={28} fill={theme.colors.text1} />
                    <Text style={{ fontSize: 18, color: theme.colors.text1, fontFamily: theme.fonts.title600, textAlignVertical: "center", flex: 0.65 }}>{GetRatingsAverage(report)}</Text>
                </View>
            </View>
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
                report.comments &&
                <CommentsModal
                    isVisible={isCommentsModalVisible}
                    closeFunction={() => {
                        setCommentsModalVisible(false)
                    }}
                    report_id={report.id}
                />
            }
            {
                isLoadingDelete ? <LoadingScreen /> : null
            }
        </View>
    );
}