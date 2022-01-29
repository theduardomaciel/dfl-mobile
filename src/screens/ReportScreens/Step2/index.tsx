import React, { useState, useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Image, ActivityIndicator } from "react-native";

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

function cachePicture(data: any, capturedPhoto: any) {
    if (capturedPhoto !== null) {
        data.append("report_image", {
            fileName: "provisório",
            height: capturedPhoto.height,
            width: capturedPhoto.width,
            uri: capturedPhoto.uri,
            type: 'type/jpeg'
        });
        return data;
    }
}

export function ReportScreen2({ navigation, data }: any) {
    const [isLoading, setIsLoading] = useState(false)

    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [hasPermission, setHasPermission] = useState(null);

    const camRef = useRef(null)
    const [capturedPhoto, setCapturedPhoto] = useState({})

    const [modalOpen, setModalOpen] = useState(false)

    async function takePicture() {
        //setIsLoading(true)
        try {
            const data = await camRef.current.takePictureAsync()
            camRef.current.pausePreview();
            console.log(data)
            setCapturedPhoto(data)
            setModalOpen(true)
        } catch (error) {
            //setIsLoading(false)
            console.log(error)
        }
    }

    async function backToPreview() {
        setIsLoading(false)
        await camRef.current.resumePreview();
        setModalOpen(false)
    }

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted')
        })();
    }, []);

    if (hasPermission === false || hasPermission === null) {
        return <View />
    }

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
                <View style={styles.cameraView}>
                    <Camera
                        style={{ flex: 1 }}
                        type={cameraType}
                        ref={camRef}
                        useCamera2Api
                    >
                        <TouchableOpacity activeOpacity={0.5} style={styles.flipCamera} onPress={() => {
                            setCameraType(
                                cameraType === Camera.Constants.Type.back ?
                                    Camera.Constants.Type.front : Camera.Constants.Type.back
                            )
                        }}>
                            <FlipCamera height={36} width={36} />
                        </TouchableOpacity>
                    </Camera>
                </View>
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
                    capturedPhoto &&
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
                                    source={{ uri: capturedPhoto.uri }}
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
                                        //const cache = cachePicture()
                                        navigation.navigate("Step3")
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