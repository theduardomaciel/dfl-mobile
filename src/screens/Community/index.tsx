import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, ImageBackground } from "react-native";

import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSpring } from "react-native-reanimated";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import Toast from 'react-native-toast-message';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Camera } from "react-native-maps";
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
import { api } from "../../utils/api";

/* const placeholder_report = {
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
 */

export function returnCamera(report: Report, markerRef, mapRef) {
    markerRef.current?.hideCallout()
    if (report) {
        const parsedLatitude = parseFloat(report.coordinates[0]) + (0.005 / 2) as number | string;
        const parsedLongitude = parseFloat(report.coordinates[1]) as number | string;

        if (parsedLatitude === "NaN" || parsedLongitude === "NaN") {
            console.log("Não foi possível obter a localização do relatório.")
            return;
        }

        console.log("Voltando câmera para o local inicial")

        const camera = {
            center: {
                latitude: parsedLatitude,
                longitude: parsedLongitude
            },
            zoom: 14
        }
        if (mapRef.current) {
            mapRef.current?.animateCamera(camera, { duration: 1000 })
        }
    } else {
        console.log("Não obtivemos o objeto do relatório ou suas coordenadas.")
    }
}

async function updateReportRating(rating, reportId, profileId) {
    console.log(rating)
    if (rating !== 0) {
        console.log("Atualizando relatório")
        const response = await api.patch(`/report/${reportId}`, {
            profile_id: profileId,
            rating: rating,
        })
        const updatedReport = response.data as Report;
        return updatedReport;
    }
}


export function Community({ navigation }) {
    const { user, updateReports } = useAuth();

    const [reports, setReports] = useState([])
    const [actualReport, setActualReport] = useState(null)

    const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 })

    async function PrepareScreen() {
        const { coords } = await Location.getCurrentPositionAsync()
        const initialCamera = {
            center: {
                latitude: coords.latitude,
                longitude: coords.longitude,
            },
            zoom: 14
        }
        setUserLocation(initialCamera.center)
        console.log("Atualizando câmera para o local do usuário.")
        mapRef.current?.setCamera(initialCamera)

        console.log("Atualizando marcadores no mapa")
        const markersArray = await ListMarkersOnMap("city", {
            latitude: coords.latitude,
            longitude: coords.longitude,
        })
        setReports(markersArray)
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

    const mapRef = useRef<MapView>(null);
    const markerRef = useRef<Marker>(null);
    const focusModalRef = useRef<BottomSheetModal>(null);

    const openFocusModal = useCallback(async (report) => {
        console.log("Alterando relatório atual e abrindo modal.")
        if (report !== actualReport) {
            setActualReport(report)
        }
        focusModalRef.current?.present();
        let camera = {
            center: {
                latitude: parseFloat(report.coordinates[0]) - 0.0035,
                longitude: parseFloat(report.coordinates[1])
            },
            zoom: 15.75
        }
        mapRef.current?.animateCamera(camera, { duration: 1000 })
    }, []);

    const closeFocusModal = useCallback(async () => {
        console.log("Fechando modal")
        focusModalRef.current?.dismiss();
        returnCamera(actualReport, markerRef, mapRef)
    }, []);

    const [rating, setRating] = useState(0)

    async function handleModalClose() {
        console.log("Fechando modal.")
        returnCamera(actualReport, markerRef, mapRef)
        const updatedReport = await updateReportRating(rating, actualReport.id, user.profile.id)
        if (updatedReport) {
            updateReports(updatedReport)
        }
    }

    const handleSheetChanges = async (index: number) => {
        console.log('handleSheetChanges', index);
        if (index === -1) {
            handleModalClose()
        }
    }

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
            type: 'error',
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
        cancelAnimation(refreshButtonRotation)
        if (success === true) {
            await PrepareScreen()
            showToast()
        } else {
            showErrorToast()
        }
        setIsLoading(false)
    }

    useEffect(() => {
        PrepareScreen()
    }, []);

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    return (
        <BottomSheetModalProvider>
            <ImageBackground progressiveRenderingEnabled source={require("../../assets/placeholders/background_placeholder.png")} style={styles.container}>
                <FocusAwareStatusBar translucent backgroundColor={"transparent"} barStyle="dark-content" />
                <View style={styles.container}>
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
                            reports &&
                            reports.map((report, index) => (
                                <Marker
                                    key={index}
                                    ref={markerRef}
                                    image={{ uri: "trashfocus_icon" }}
                                    coordinate={{
                                        latitude: parseFloat(report.coordinates[0]),
                                        longitude: parseFloat(report.coordinates[1])
                                    }}
                                    onPress={() => openFocusModal(report)}
                                    calloutAnchor={{ x: 4.825, y: -0.15 }}
                                >
                                    {
                                        userLocation &&
                                        <Callout tooltip onPress={() => openFocusModal(report)}>
                                            <FocusCallout report={report} region={userLocation} />
                                        </Callout>
                                    }
                                </Marker>
                            ))
                        }
                    </MapView>
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
                <FocusModal
                    ref={focusModalRef}
                    report={actualReport}
                    profile={user.profile}
                    setRating={setRating}
                    handleSheetChanges={handleSheetChanges}
                />
            </ImageBackground >
        </BottomSheetModalProvider>
    );
}