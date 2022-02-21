import React from "react";
import { View, StatusBar, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";
import { MaterialIcons, Entypo } from "@expo/vector-icons"
import { SectionTitle } from "../../components/SectionTitle";
import { BottomBar } from "../../components/BottomBar";
import { TextButton } from "../../components/TextButton";

type Report = {
    id: number,
    address: string,
    coordinates: Array<number>,
    image_url: string,
    image_deleteHash: string,
    tags: string,
    suggestion: string,
    hasTrashBins: boolean
    resolved: boolean;
}

export function Report({ route, navigation }) {
    const report = route.params.item as Report;

    const latitude = typeof report.coordinates[0] === "string" ? parseFloat(report.coordinates[0]) : report.coordinates[0]
    const longitude = typeof report.coordinates[1] === "string" ? parseFloat(report.coordinates[1]) : report.coordinates[0]
    const reportRegion = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    }

    const suggestion = report.suggestion ? report.suggestion : "[nenhuma sugestão foi informada]"

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
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
                    <Entypo name="dots-three-vertical" size={18} color="#FFFFFF" />
                </View>
            </LinearGradient>
            <View style={styles.image}>
                <Image style={{ flex: 1 }} source={{ uri: report.image_url }} />
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
            <SectionTitle title="Localização:" fontStyle={{ fontSize: 18 }} marginBottom={5} />
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
            <BottomBar info={report.address} viewStyle={{ marginBottom: 15 }} />
            <SectionTitle title="Detalhes:" fontStyle={{ fontSize: 18 }} marginBottom={5} />
            <View style={[elements.subContainerWhite, { flex: 1 }]}>
                <TextButton title="+" buttonStyle={{ paddingHorizontal: 8, paddingVertical: 1, borderRadius: 8, position: "absolute", right: 0, top: -30 }} />
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
        </View>
    );
}