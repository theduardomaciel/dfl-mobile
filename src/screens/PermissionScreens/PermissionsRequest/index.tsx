import React, { useRef, useState, useCallback } from "react";
import { Text, View, FlatList, Animated, ViewToken, Linking, Platform, Modal, PermissionsAndroid } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { permissions_screens } from "../../../utils/permissions"
import Logo from "../../../assets/Logo.svg"

import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";

import { OnboardingItem } from "../../../components/OnboardingItem";
import { Paginator } from "../../../components/Paginator";

import { ModalBase } from "../../../components/ModalBase";
import { TextButton } from "../../../components/TextButton";
import { HintView, HintViewTextStyle } from "../../../components/HintView";
import { ConclusionScreen } from "../../../components/ConclusionScreen";

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

const Bold = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

let BUTTON_COLORS = [theme.colors.primary1, theme.colors.primary1]
let BUTTONS_TEXTS = ["Permitir acesso à localização", "Permitir acesso à câmera"]

let CameraPermission = false;
let LocationPermission = false
export function PermissionsRequest({ navigation }) {
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
                    <Text style={[HintViewTextStyle, { textAlignVertical: "center", textAlign: "center", fontSize: 12 }]}>Ao permitir, selecione a opção <Bold>“Durante o uso do app”</Bold> para que a permissão não seja requerida a todo momento.</Text>
                )
            }
            customStyle={{ width: "90%", marginTop: 15, marginBottom: 15 }}
        />
    )

    const [isModalVisible, setModalVisible] = useState(false);

    function CameraGranted() {
        console.log("A permissão para uso da câmera foi garantida.")
        CameraPermission = true
        BUTTONS_TEXTS[1] = "Continuar"
        if (CameraPermission && LocationPermission) {
            console.log("As duas permissões já foram concedidas, proseguindo...")
            setModalVisible(true)
        } else {
            scrollTo(0)
            setCurrentIndex(0)
        }
    }
    function LocationGranted() {
        console.log("A permissão para uso da localização foi garantida.")
        LocationPermission = true
        BUTTONS_TEXTS[0] = "Continuar"
        if (CameraPermission && LocationPermission) {
            console.log("As duas permissões já foram concedidas, proseguindo...")
            setModalVisible(true)
        } else {
            scrollTo(1)
            setCurrentIndex(1)
        }
    }

    /* {
        title: "Permissão Necessária",
        message:
            "O acesso à câmera é um elemento fundamental para o funcionamento do aplicativo. ",
        buttonPositive: "Continuar"
    }, */

    async function RequestCameraPermission() {
        let permissionToCheck;
        if (Platform.OS === "android") {
            permissionToCheck = PERMISSIONS.ANDROID.CAMERA
        } else if (Platform.OS === "ios") {
            permissionToCheck = PERMISSIONS.IOS.CAMERA
        }
        check(permissionToCheck)
            .then(async (result) => {
                switch (result) {
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        request(permissionToCheck).then((result) => {
                            if (result === RESULTS.GRANTED) {
                                return CameraGranted();
                            }
                        });
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        CameraGranted();
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        await Linking.openSettings();
                        break;
                }
            })
    }

    async function RequestLocationPermission() {
        let permissionToCheck;
        if (Platform.OS === "android") {
            permissionToCheck = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        } else if (Platform.OS === "ios") {
            permissionToCheck = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        }
        check(permissionToCheck)
            .then(async (result) => {
                switch (result) {
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        request(permissionToCheck).then((result) => {
                            if (result === RESULTS.GRANTED) {
                                return LocationGranted();
                            }
                        });
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        LocationGranted();
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        await Linking.openSettings();
                        break;
                }
            })
    }
    const FUNCTIONS = [RequestLocationPermission, RequestCameraPermission]

    return (
        <View style={styles.container}>
            <Logo height={75} width={150} />
            <View style={{ flex: 0.8, marginTop: 48 }}>
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

            {
                isModalVisible && <Modal
                    transparent={false}
                    animationType={"slide"}
                    statusBarTranslucent
                >
                    <ConclusionScreen
                        title="O DFL está pronto para você!"
                        info={`Tudo está configurado.\nAgora é sua vez de tornar sua cidade cada vez mais limpa!`}
                        backButtonText="Ir para o app"
                        onPress={() => {
                            navigation.navigate('Main')
                            setModalVisible(false)
                        }}
                    />
                </Modal>
            }

            <View style={styles.footer}>
                <Paginator data={permissions_screens} scrollX={scrollX} scrollTo={scrollTo} />
                <TextButton buttonStyle={{ backgroundColor: BUTTON_COLORS[currentIndex], paddingHorizontal: 20, paddingVertical: 15 }} title={BUTTONS_TEXTS[currentIndex]} onPress={FUNCTIONS[currentIndex]} />
                {/* <Text style={styles.info}>Negar a permissão tornará impossível utilizar o aplicativo.</Text> */}
            </View>
        </View>
    );
}