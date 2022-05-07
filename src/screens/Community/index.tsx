import React, { useState, useEffect, useRef } from "react";
import { View, Text, ImageBackground, Dimensions, Pressable } from "react-native";

import Toast from 'react-native-toast-message';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, LatLng } from "react-native-maps";
import * as Location from "expo-location";

import { ProfileModal } from "../../components/ProfileModal";
import { MapScopePicker } from "../../components/MapScopePicker";

import { theme } from "../../global/styles/theme";
import { styles } from "./styles";

const GarbageBagIcon = require("../../assets/icons/garbage_bag.png")
import { MaterialIcons } from "@expo/vector-icons"

import { useAuth } from "../../hooks/useAuth";

import { ListMarkersOnMap } from "../../utils/functions/ListMarkersOnMap";
import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";

import { Region, Report } from "../../@types/application";

import { api } from "../../utils/api";
import { UpdateNavigationBar } from "../../utils/functions/UpdateNavigationBar";

import { TextForm } from "../../components/TextForm";
import { TagSection } from "../../components/TagsSelector";

import { RectButton } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";

import { FocusCallout } from "./Callouts/FocusCallout";
import { FocusModal } from "./Modals/FocusModal";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSpring } from "react-native-reanimated";

const dimensions = Dimensions.get("screen")

const placeholder_report = {
    profile: {
        username: "",
        profile_image: "https://github.com/theduardomaciel.png",
        id: 1,
        image_url: "https://github.com/theduardomaciel.png",
        level: 0,
        experience: 0,
        reports: [],
        ratings: "",
    },
    id: 1,
    createdAt: "Thu Apr 28 2022 16:58:17 GMT-0300 (Horário Padrão de Brasília)",
    address: "",
    coordinates: ['', ''],
    image_url: "https://github.com/theduardomaciel.png",
    image_deleteHash: "",
    tags: "",
    suggestion: "",
    hasTrashBins: false,
    profile_id: 1,

    note1: 0,
    note2: 0,
    note3: 0,
    note4: 0,
    note5: 0,

    resolved: false,
    comments: [],
}

let firstUpdate = true
let modalIsVisible = false

export function Community({ navigation }) {
    const { user, updateReports } = useAuth();

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    const [isFirstModalVisible, setFirstModalVisible] = useState(false)
    const firstToggleModal = () => {
        setFirstModalVisible(!isFirstModalVisible)
    }

    const [isSecondModalVisible, setSecondModalVisible] = useState(false)
    const secondToggleModal = () => {
        setSecondModalVisible(!isSecondModalVisible)
    }

    const [reports, setReports] = useState([])
    const getScopePicked = async (scope, newRegion?) => {
        if (newRegion) setRegion(newRegion);
        const markersArray = await ListMarkersOnMap(scope, newRegion)
        setReports(markersArray)
    }

    const [region, setRegion] = useState<Region>(null);

    async function PrepareScreen() {
        const { coords } = await Location.getCurrentPositionAsync()
        const newRegion = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
        }
        setRegion(newRegion);
        const initialCamera = {
            center: {
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
            },
            zoom: 14
        }
        console.log("Atualizando câmera para o local do usuário.")
        mapRef.current?.setCamera(initialCamera)
    }

    const refreshButtonRotation = useSharedValue(0);
    const refreshButtonRotationStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${refreshButtonRotation.value}deg`
                },
            ],
        };
    });

    useEffect(() => {
        PrepareScreen()
        getScopePicked("city")
        async function CheckIfProfileIsCreated() {
            if (user.profile.username == "") {
                console.log("Usuário não possui perfil. Exibindo modal para criação.")
                setFirstModalVisible(true)
            }
        }
        CheckIfProfileIsCreated()
        firstUpdate = false
    }, []);

    const [filters, setFilters] = useState({});
    const handleFilters = (section, tags) => {
        const tagsCopy = filters;
        tagsCopy[section] = tags;
        setFilters(tagsCopy)
    }

    const [actualMarker, setActualMarker] = useState<Report>(placeholder_report);

    const mapRef = useRef<MapView>(null);
    const markerRef = useRef<Marker>(null);
    const modalizeRef = useRef<Modalize>(null);

    interface Camera {
        center: LatLng;
        zoom: number;
    }

    useEffect(() => {
        if (!firstUpdate) {
            onOpen()
        }
    }, [actualMarker]);


    const onOpen = () => {
        modalIsVisible = true
        modalizeRef.current?.open();
    };
    const onClose = () => {
        modalIsVisible = false;
        modalizeRef.current?.close();
    };

    const showToast = () => {
        console.log("Mostrando toast de sucesso.")
        Toast.show({
            type: 'success',
            text1: 'Eba! Deu tudo certo.',
            text2: 'Os relatórios de sua cidade foram atualizados com sucesso!',
        });
    }

    const showErrorToast = () => {
        console.log("Mostrando toast de erro.")
        Toast.show({
            type: 'success',
            text1: 'Opa! Algo deu errado...',
            text2: 'Infelizmente não possível atualizar os relatórios de sua cidade.',
        });
    }

    const [isLoading, setIsLoading] = useState(false)
    const refreshReports = async () => {
        setIsLoading(true)
        console.log("Atualizando relatórios.")
        refreshButtonRotation.value = withRepeat(withSpring(refreshButtonRotation.value + 360, { damping: 15, restSpeedThreshold: 1 }), -1, false)
        const success = await updateReports()
        if (success) {
            getScopePicked("city")
            showToast()
            cancelAnimation(refreshButtonRotation)
        } else {
            showErrorToast()
        }
        setIsLoading(false)
    }

    return (
        <ImageBackground source={require("../../assets/placeholders/background_placeholder.png")} style={styles.container}>
            <FocusAwareStatusBar translucent barStyle="dark-content" />

            <View style={styles.container}>
                {
                    region !== null &&
                    <MapView
                        style={{ height: "100%", width: "100%" }}
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        minZoomLevel={10}
                        toolbarEnabled={false}
                        maxZoomLevel={17}
                        mapPadding={{
                            bottom: 0, top: 175, left: 15, right: 15
                        }}
                        loadingEnabled
                        loadingIndicatorColor={theme.colors.primary1}
                        loadingBackgroundColor={theme.colors.background}
                        onPress={() => {
                            if (modalIsVisible) {
                                console.log("Modal está visível. Ocultando-o.")
                                onClose()
                            }
                        }}
                    >
                        {
                            reports ?
                                reports.map((report, index) => (
                                    <Marker
                                        key={index}
                                        ref={markerRef}
                                        image={{ uri: "trashfocus_icon" }}
                                        coordinate={{
                                            latitude: parseFloat(report.coordinates[0]),
                                            longitude: parseFloat(report.coordinates[1])
                                            //latitude: typeof report.coordinates[0] !== "number" ?  : report.coordinates[0],
                                            //longitude: typeof report.coordinates[0] !== "number" ? parseFloat(report.coordinates[1]) : report.coordinates[1]
                                        }}
                                        onPress={async () => {
                                            console.log("Alterando relatório atual e abrindo modal.")
                                            //console.log("Antes: ", actualMarker)
                                            if (report !== actualMarker) {
                                                await setActualMarker(report)
                                            } else {
                                                onOpen()
                                            }
                                            const camera = await mapRef.current?.getCamera() as Camera;
                                            camera.center = {
                                                latitude: parseFloat(report.coordinates[0]) - 0.0035,
                                                longitude: parseFloat(report.coordinates[1])
                                            }
                                            camera.zoom = 15.75
                                            mapRef.current?.animateCamera(camera, { duration: 1000 })
                                        }}
                                        calloutAnchor={{ x: 4.825, y: -0.15 }}
                                    >
                                        {
                                            region !== undefined &&
                                            <Callout tooltip>
                                                <FocusCallout report={report} region={region} />
                                            </Callout>
                                        }
                                    </Marker>
                                ))
                                : null
                        }
                        {/* <Geojson
                        geojson={}
                        strokeColor="#FF6D6A"
                        fillColor="#ffffff80"
                        strokeWidth={5}
                    /> */}
                    </MapView>
                }
            </View>
            <View style={styles.header}>
                <View style={styles.subHeader}>
                    <Text style={styles.title}>
                        Comunidade
                    </Text>
                    <Animated.View style={[styles.reloadButton, refreshButtonRotationStyle]}>
                        <RectButton style={styles.reloadButton} onPress={refreshReports} enabled={!isLoading}>
                            <MaterialIcons name="refresh" color={isLoading ? theme.colors.light_gray2 : theme.colors.secondary1} size={32} />
                        </RectButton>
                    </Animated.View>
                </View>
                <TextForm
                    customStyle={styles.searchBar}
                    shadow
                    textInputProps={{
                        placeholder: `Pesquisar relatos (ex.: bairro, cidade, estado)`,
                        placeholderTextColor: theme.colors.gray_light,
                        autoCapitalize: "none",
                        onSubmitEditing: ({ nativeEvent: { text } }) => { text.length > 0 && navigation.navigate("Search", { search: text }) }
                    }}
                    icon={<MaterialIcons name="search" size={24} color={theme.colors.secondary1} />}
                />
                <View style={styles.filterContainer}>
                    <View style={styles.filterView}>
                        <MaterialIcons name="filter-alt" color={theme.colors.text1} size={24} />
                        <Text style={styles.subtitle}>Filtros</Text>
                    </View>
                    <TagSection height={35} section="filter" tags={['Focos de Lixo', 'Ecopontos', 'Lixeiras']} onSelectTags={handleFilters} />
                </View>
            </View>

            {/* <View style={{ position: "absolute", bottom: 65, right: 15 }}>
                <MapScopePicker changedScope={getScopePicked} actualRegion={region} biggerScope />
            </View> */}
            <ProfileModal
                isVisible={isFirstModalVisible}
                toggleModal={firstToggleModal}
                secondToggleModal={secondToggleModal}
            />
            <ProfileModal
                onBackdropPress={() => {
                    firstToggleModal()
                    secondToggleModal()
                }}
                isSecond
                isVisible={isSecondModalVisible}
                toggleModal={secondToggleModal}
                secondToggleModal={firstToggleModal}
            />
            <FocusModal
                modalizeRef={modalizeRef}
                markerRef={markerRef}
                mapRef={mapRef}
                report={actualMarker}
                user={user}
            />
        </ImageBackground >
    );
}