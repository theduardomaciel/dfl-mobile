import React, { useState, useEffect } from "react";
import { View, Text, Modal } from "react-native";

import { Camera } from "expo-camera";

import { theme } from "../../../global/styles/theme";

import { defaultStyles } from "../defaultStyles";
import { styles } from "./styles";

import { AntDesign } from '@expo/vector-icons';
import { BottomBar } from "../../../components/BottomBar";
import { TextButton } from "../../../components/TextButton";

export function ReportScreen2({ navigation }: any) {
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted')
            if (hasPermission === false || hasPermission === null) {
                return <View />
            }
        })();
    }, []);

    const [hasPhoto, setHasPhoto] = useState(false)
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
                <Camera
                    style={styles.cameraView}
                    type={cameraType}
                />
            </View>
        </View>
    );
}