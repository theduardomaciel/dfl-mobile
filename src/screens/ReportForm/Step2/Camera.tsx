import { CameraType, Camera } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { cameraPermission } from "../../../utils/permissionsToCheck";

import CameraIcon from "../../../assets/camera/photo_camera.svg"
import FlipCamera from "../../../assets/camera/flip_camera.svg"

import { BottomBar } from "../../../components/BottomBar";

import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";
import { check, RESULTS } from "react-native-permissions";
import { useNavigation } from "@react-navigation/native";

export default function CameraObject({ images, setImages, setModalOpen }) {
    const navigation = useNavigation();

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);

    const [isLoading, setIsLoading] = useState(false)
    const options = { quality: 0.75, base64: true };

    const camera = useRef<Camera>(null);
    async function takePicture() {
        console.log("Tirando foto com a câmera.")
        setIsLoading(true)
        try {
            if (camera.current) {
                const imageData = await camera.current.takePictureAsync(options)
                /* const source = imageData.base64 */
                setIsLoading(false)
                if (imageData) {
                    let imagesArray = images;
                    imagesArray.push(imageData)
                    setImages(imagesArray)
                    setModalOpen(true)
                    console.log("Adicionando imagem.", imagesArray.length)
                } else {
                    console.log("A imagem não foi convertida em Base64.")
                }
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        async function checkPermission() {
            check(cameraPermission)
                .then(async (result) => {
                    if (result !== RESULTS.GRANTED) {
                        return navigation.navigate("PermissionsRequest" as never, { permission: "camera" } as never);
                    } else {
                        console.log("Permissão para acessar a câmera concedida.")
                        setHasPermission(true);
                    }
                });
        }
        const unsubscribe = navigation.addListener('focus', checkPermission);
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    if (hasPermission === false) {
        return <Text>Por favor, nos permita ter acesso à câmera.</Text>;
    }

    if (hasPermission === null) {
        return <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
            <ActivityIndicator size="large" color={theme.colors.primary1} />
        </View>
    }

    function flipCameraHandler() {
        setType(type === CameraType.back ? CameraType.front : CameraType.back);
    }

    return (
        <>
            <Camera ref={camera} style={styles.camera} type={type}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.flipButton}
                        onPress={flipCameraHandler}>
                        <FlipCamera height={36} width={36} />
                    </TouchableOpacity>
                </View>
            </Camera>
            <BottomBar
                viewStyle={{ marginBottom: 25, height: 65 }}
                element={
                    <TouchableOpacity disabled={isLoading} style={styles.bottomBar} onPress={takePicture}>
                        {isLoading ? <ActivityIndicator size="large" color={theme.colors.text1} /> :
                            <CameraIcon height={48} width={48} />}
                    </TouchableOpacity>
                }
            />
        </>
    );
}