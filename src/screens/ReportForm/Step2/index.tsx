import React, { useState, useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Image, ActivityIndicator, Dimensions, Platform } from "react-native";

import { Camera } from "expo-camera";

import { theme } from "../../../global/styles/theme";
import { defaultStyles } from "../defaultStyles";
import { styles } from "./styles";

import CameraIcon from "../../../assets/camera/photo_camera.svg"
import NewPhotoIcon from "../../../assets/camera/new_photo.svg"
import FlipCamera from "../../../assets/camera/flip_camera.svg"

import { AntDesign } from '@expo/vector-icons';

import { TextButton } from "../../../components/TextButton";
import { BottomBar } from "../../../components/BottomBar";

import { useFocusEffect } from "@react-navigation/native";

const { height, width } = Dimensions.get('window')

export function ReportScreen2({ route, navigation }: any) {
    const { data } = route.params;
    const [isLoading, setIsLoading] = useState(false)

    const options = { quality: 0.5, base64: true };
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [activateCamera, setActivateCamera] = useState(false)

    const cameraRef = useRef(null)
    const [image, setImage] = useState({} as any)
    const [modalOpen, setModalOpen] = useState(false)

    async function takePicture() {
        //setIsLoading(true)
        try {
            const imageData = await cameraRef.current.takePictureAsync(options)
            const source = imageData.base64
            if (source) {
                cameraRef.current.pausePreview();
                setImage(imageData)
                data.image_base64 = source;
                setModalOpen(true)
            } else {
                return console.log("A imagem não foi convertida em Base64.")
            }
        } catch (error) {
            //setIsLoading(false)
            console.log(error)
        }
    }

    async function backToPreview() {
        //setIsLoading(false) 
        await cameraRef.current.resumePreview();
        setModalOpen(false)
    }

    // RATIO SETTER - código original: https://askandroidquestions.com/2021/05/27/react-native-expo-camera-ratio-and-preview-not-configurable-enough/
    const [ratio, setRatio] = useState('4:3') // default is 4:3
    const screenRatio = height / width
    const [isRatioSet, setIsRatioSet] = useState(false)
    async function prepareRatio() {
        let desiredRatio = '4:3' // Start with the system default
        // This issue only affects Android
        if (Platform.OS === 'android') {
            const ratios = await cameraRef.current.getSupportedRatiosAsync()
            let distances = {}
            let realRatios = {}
            let minDistance = null
            for (const ratio of ratios) {
                const parts = ratio.split(':')
                const ratioHeight = parseInt(parts[0])
                const ratioWidth = parseInt(parts[1])
                const realRatio = ratioHeight / ratioWidth
                realRatios[ratio] = realRatio
                // ratio can't be taller than screen, so we don't want an abs()
                const distance = screenRatio - realRatio
                distances[ratio] = realRatio
                if (minDistance == null) {
                    minDistance = ratio
                } else {
                    if (distance >= 0 && distance < distances[minDistance]) {
                        minDistance = ratio
                    }
                }
            }
            // set the best match
            desiredRatio = minDistance

            // set the preview padding and preview ratio
            setRatio(desiredRatio)
            // Set a flag so we don't do this
            // calculation each time the screen refreshes
            setIsRatioSet(true)
        }
    }

    const setCameraReady = async () => {
        if (!isRatioSet) {
            await prepareRatio()
        }
    }

    function flipCameraHandler() {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        )
    }

    useFocusEffect(() => {
        if (navigation.isFocused()) {
            setActivateCamera(true)
        }
    })

    return (
        <View style={defaultStyles.container}>
            <View style={defaultStyles.safeView}>
                <View style={defaultStyles.header}>
                    <Text style={defaultStyles.stepTitle}>2 | IMAGEM DO LOCAL</Text>
                    <AntDesign name="left" size={24} color={theme.colors.primary1} onPress={() => navigation.goBack()} />
                </View>
                <Text style={defaultStyles.title}>
                    Tire uma foto para mostrar o local afetado pelo foco de lixo.
                </Text>
                {activateCamera && (
                    <View style={styles.cameraView}>
                        <Camera
                            style={{ flex: 1 }}
                            onCameraReady={setCameraReady}
                            type={cameraType}
                            ratio={ratio}
                            autoFocus={"on"}
                            ref={cameraRef}
                            useCamera2Api
                        >
                            <TouchableOpacity activeOpacity={0.5} style={styles.flipCamera} onPress={flipCameraHandler}>
                                <FlipCamera height={36} width={36} />
                            </TouchableOpacity>
                        </Camera>
                    </View>
                )}

                <BottomBar
                    viewStyle={{ marginBottom: 35 }}
                    element={
                        <TouchableOpacity style={styles.bottomBar} onPress={takePicture}>
                            {isLoading ? <ActivityIndicator size="large" color={theme.colors.text1} /> :
                                <CameraIcon height={48} width={48} />}
                        </TouchableOpacity>
                    }
                />

                {
                    image &&
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={modalOpen}
                    >
                        <View style={defaultStyles.container}>
                            <View style={defaultStyles.safeView}>
                                <Text style={defaultStyles.title}>
                                    E aí, gostou da foto, ou vai querer tirar outra?
                                </Text>
                                <Image
                                    style={[styles.cameraView, { borderRadius: 15 }]}
                                    source={{ uri: image.uri }}
                                />
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={styles.newPhotoButton}
                                    onPress={backToPreview}
                                >
                                    <NewPhotoIcon height={42} width={42} />
                                </TouchableOpacity>
                                <TextButton
                                    title="Próximo passo"
                                    colors={[theme.colors.secondary1, theme.colors.secondary2]}
                                    buttonStyle={{ height: 45, width: "90%", marginBottom: 20, marginTop: 20 }}
                                    onPress={() => {
                                        navigation.navigate("Step3", { data })
                                    }}
                                />
                            </View>
                        </View>
                    </Modal>
                }
            </View>
        </View>
    );
}