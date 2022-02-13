import React, { useRef, useState, useCallback } from "react";
import { Text, View, FlatList, Animated, ViewToken, Linking, Platform } from "react-native";
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { permissions_screens } from "../../../utils/permissions"
import Logo from "../../../assets/Logo.svg"

import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";

import { OnboardingItem } from "../../../components/OnboardingItem";
import { Paginator } from "../../../components/Paginator";

import { ModalBase } from "../../../components/ModalBase";
import { TextButton } from "../../../components/TextButton";
import { HintView, HintViewTextStyle } from "../../../components/HintView";

import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

const Bold = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

const BUTTONS_TEXTS = ["Permitir acesso à localização", "Permitir acesso à câmera"]

let CameraPermission = false;
let LocationPermission = false
export function PermissionsResquest() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = (index: number) => {
        if (slidesRef.current !== null) {
            slidesRef.current.scrollToIndex({ index: index })
        }
    };

    // Utilizamos o "callback" para que o valor do "state" seja atualizado apenas quando o usuário clicar no botão
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        return setCurrentIndex(viewableItems[0].index)
    }, []);

    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const Hint = () => (
        <HintView
            CustomText={
                () => (
                    <Text style={[HintViewTextStyle, { textAlignVertical: "center", textAlign: "center", fontSize: 11 }]}>Ao permitir, selecione a opção <Bold>“Durante o uso do app”</Bold> para que a permissão não seja requerida a todo momento.</Text>
                )
            }
            customStyle={{ width: "85%", marginTop: 15, marginBottom: 15 }}
        />
    )

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalDescription, setModalDescription] = useState("");

    async function RequestCameraPermission() {
        const { status } = await Camera.requestCameraPermissionsAsync();
        console.log(status)
        if (status !== 'granted') {
            CameraPermission = false;
            setModalDescription("A permissão de acesso da câmera foi negada.")
            let permissionToCheck;
            if (Platform.OS === "android") {
                permissionToCheck = PERMISSIONS.ANDROID.CAMERA
            } else if (Platform.OS === "ios") {
                permissionToCheck = PERMISSIONS.IOS.CAMERA
            }
            check(permissionToCheck)
                .then(async (result) => {
                    if (result === RESULTS.BLOCKED) {
                        await Linking.openSettings();
                    }
                })
            return setModalVisible(true)
        } else {
            CameraPermission = true
            console.log(CameraPermission, LocationPermission)
            if (CameraPermission && LocationPermission) {
                console.log("Duas permissões.")
            } else if (!LocationPermission) {
                scrollTo(0)
                setCurrentIndex(0)
            }
        }
    }

    async function RequestLocationPermission() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log(status)
        if (status !== 'granted') {
            LocationPermission = false;
            setModalDescription("A permissão de acesso da localização foi negada.")
            let permissionToCheck;
            if (Platform.OS === "android") {
                permissionToCheck = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            } else if (Platform.OS === "ios") {
                permissionToCheck = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            }
            console.log(permissionToCheck)
            check(permissionToCheck)
                .then(async (result) => {
                    console.log(result)
                    if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
                        await Linking.openSettings();
                    }
                })
            return setModalVisible(true)
        } else {
            LocationPermission = true
            if (CameraPermission && LocationPermission) {
                console.log("Duas permissões.")
            }
            scrollTo(1)
            setCurrentIndex(1)
        }
    }
    const FUNCTIONS = [RequestLocationPermission, RequestCameraPermission]

    return (
        <View style={styles.container}>
            <Logo height={75} width={150} />
            <View style={{ flex: 0.75, marginTop: 48 }}>
                <FlatList style={styles.list}
                    data={permissions_screens}
                    renderItem={({ item }) => <OnboardingItem image={item.icon} title={item.title} description={item.description} children={<Hint />} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={item => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={32}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    viewabilityConfig={viewabilityConfig}
                    ref={slidesRef}
                />
            </View>

            {/* <ModalBase
                title="Não foi possível autenticar."
                description={`Nossos servidores devem estar passando por problemas no momento :( \n Tente novamente mais tarde.`}
                button
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                toggleModal={() => { setModalVisible(false) }}
            /> */}

            <View style={styles.footer}>
                <Paginator data={permissions_screens} scrollX={scrollX} scrollTo={scrollTo} />
                <TextButton buttonStyle={{ paddingHorizontal: 20, paddingVertical: 15 }} title={BUTTONS_TEXTS[currentIndex]} onPress={FUNCTIONS[currentIndex]} />
                {/* <Text style={styles.info}>Negar a permissão tornará impossível utilizar o aplicativo.</Text> */}
            </View>
        </View>
    );
}