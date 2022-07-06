import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, ImageBackground } from "react-native";

import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSpring } from "react-native-reanimated";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import Toast from 'react-native-toast-message';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, LatLng } from "react-native-maps";
import * as Location from "expo-location";

import { theme } from "../../global/styles/theme";
import { styles } from "./styles";
import { MaterialIcons } from "@expo/vector-icons"

import { useAuth } from "../../hooks/useAuth";

import ListMarkersOnMap from "../../utils/functions/ListMarkersOnMap";
import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";

import { Region, Report } from "../../@types/application";

import { TextForm } from "../../components/TextForm";
import { TagSection } from "../../components/TagsSelector";

import { RectButton } from "react-native-gesture-handler";

import { FocusCallout } from "./Callouts/FocusCallout";
import { FocusModal } from "./Modals/FocusModal";

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
    images_urls: ["https://github.com/theduardomaciel.png"],
    images_deleteHashs: [""],
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

interface Camera {
    center: LatLng;
    zoom: number;
}

export function Community({ navigation }) {
    const { user, updateReports } = useAuth();

    const [reports, setReports] = useState([])

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    const [region, setRegion] = useState<Region>(null);
    const getScopePicked = async (scope, newRegion?) => {
        if (newRegion) setRegion(newRegion);
        const markersArray = await ListMarkersOnMap(scope, newRegion)
        setReports(markersArray)
    }

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

    const [filters, setFilters] = useState({});
    const handleFilters = (section, tags) => {
        const tagsCopy = filters;
        tagsCopy[section] = tags;
        setFilters(tagsCopy)
    }

    const [actualMarker, setActualMarker] = useState<Report>(placeholder_report);

    const mapRef = useRef<MapView>(null);
    const markerRef = useRef<Marker>(null);
    const focusModalRef = useRef<BottomSheetModal>(null);

    const openFocusModal = useCallback(() => {
        focusModalRef.current?.present();
    }, []);

    const closeFocusModal = useCallback(() => {
        focusModalRef.current?.dismiss();
    }, []);

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
    async function refreshReports() {
        setIsLoading(true)
        console.log("Atualizando relatórios.")
        refreshButtonRotation.value = withRepeat(withSpring(refreshButtonRotation.value + 360, { damping: 15, restSpeedThreshold: 1 }), -1, false)
        const success = await updateReports()
        if (success === true) {
            getScopePicked("city")
            showToast()
            cancelAnimation(refreshButtonRotation)
        } else {
            showErrorToast()
        }
        setIsLoading(false)
    }

    const onDismiss = () => {

    }

    useEffect(() => {
        openFocusModal();
    }, [actualMarker]);

    useEffect(() => {
        PrepareScreen()
        getScopePicked("city")
    }, []);

    return (
        <BottomSheetModalProvider>
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
                                bottom: 0, top: 200, left: 15, right: 15
                            }}
                            loadingEnabled
                            loadingIndicatorColor={theme.colors.primary1}
                            loadingBackgroundColor={theme.colors.background}
                            onPress={() => {
                                console.log("Ocultando modal.")
                                closeFocusModal();
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
                                                openFocusModal()
                                                //console.log("Antes: ", actualMarker)
                                                if (report !== actualMarker) {
                                                    await setActualMarker(report)
                                                } else {
                                                    console.log("Abrindo modal")
                                                    openFocusModal()
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
                            Sua Cidade
                        </Text>
                        <Animated.View style={[styles.reloadButton, refreshButtonRotationStyle]}>
                            <RectButton style={styles.reloadButton} onPress={refreshReports} enabled={!isLoading}>
                                <MaterialIcons name="refresh" color={isLoading ? theme.colors.light_gray2 : theme.colors.secondary1} size={32} />
                            </RectButton>
                        </Animated.View>
                    </View>
                    <View style={styles.cityContainer}>
                        <Text style={styles.cityText}>{`Maceió, AL`}</Text>
                        <MaterialIcons name="verified" size={16} color={theme.colors.secondary1} />
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
                <FocusModal
                    ref={focusModalRef}
                    report={actualMarker}
                    profile={user.profile}
                    onDismiss={onDismiss}
                />
            </ImageBackground >
        </BottomSheetModalProvider>
    );
}