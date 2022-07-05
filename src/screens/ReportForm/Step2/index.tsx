import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Image, Animated, FlatList, ViewToken, Dimensions } from "react-native";

import { theme } from "../../../global/styles/theme";
import { defaultStyles } from "../defaultStyles";
import { styles } from "./styles";

import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import { TextButton } from "../../../components/TextButton";

import CameraObject from "./Camera";
import { Paginator } from "../../../components/Paginator";
import { ModalBase } from "../../../components/ModalBase";

type PropTypes = {
    viewableItems: Array<ViewToken>;
}

const width = Dimensions.get("window").width

export function ReportScreen2({ route, navigation }: any) {
    const { data } = route.params;

    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [images, setImages] = useState<Array<any>>([])

    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const onViewableItemsChanged = useCallback(({ viewableItems }: PropTypes) => {
        return setCurrentIndex(viewableItems[0].index)
    }, []);
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const scrollTo = (index: number) => {
        if (slidesRef.current !== null) {
            slidesRef.current.scrollToIndex({ index: index })
        }
    };

    async function deleteImage() {
        console.log(currentIndex)
        let imagesArray = images;
        imagesArray.splice(currentIndex, 1)
        setImages(imagesArray)
        if (imagesArray.length === 0) {
            setModalOpen(false)
        } else {
            if (currentIndex === 0) {
                setCurrentIndex(currentIndex + 1)
                //scrollTo(currentIndex + 1)
            } else {
                setCurrentIndex(currentIndex - 1)
                scrollTo(currentIndex - 1)
            }
        }
    }

    function AddImagesToData() {
        const imagesBase64 = images.map(image => image.base64)
        data.images_base64 = imagesBase64;
        navigation.navigate("Step3", { data })
    }

    return (
        <View style={defaultStyles.container}>
            <View style={defaultStyles.safeView}>
                <View style={defaultStyles.header}>
                    <Text style={defaultStyles.stepTitle}>2 | IMAGEM DO LOCAL</Text>
                    <AntDesign name="left" size={24} color={theme.colors.primary1} onPress={() => {
                        navigation.goBack()
                    }} />
                </View>
                <Text style={defaultStyles.title}>
                    Tire uma foto e mostre o local afetado pelo foco de lixo.
                </Text>

                <View style={styles.cameraView}>
                    <CameraObject images={images} setImages={setImages} setModalOpen={setModalOpen} />
                </View>

                <ModalBase
                    title="Opa! Calma aí..."
                    description="Você pode adicionar, no máximo, 3 imagens a um relatório. Nos desculpe."
                    toggleModal={() => setErrorModalVisible(false)}
                    isVisible={errorModalVisible}
                    onBackdropPress={() => setErrorModalVisible(false)}
                    backButton
                />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalOpen}
                >
                    <View style={defaultStyles.container}>
                        <View style={[defaultStyles.safeView, { marginTop: 35 }]}>
                            <Text style={defaultStyles.title}>
                                E aí, gostou da foto, ou vai querer tirar outra?
                            </Text>
                            <View style={styles.listContainer}>
                                <FlatList
                                    style={{ flex: images.length > 1 ? images.length : 1 }}
                                    data={images}
                                    renderItem={({ item }) => <Image
                                        style={[styles.cameraView, {
                                            borderRadius: 15,
                                            backgroundColor: theme.colors.secondary2,
                                            width: (width / 100) * 90,
                                            height: "100%"
                                        }]}
                                        source={{ uri: item.uri }}
                                    /> /* {
                                            console.log(item.width, item.height)
                                            return (
                                                <Image
                                                    style={[styles.cameraView, { borderRadius: 15, backgroundColor: "pink", width: (width / 100) * 90, height: "100%" }]}
                                                    source={{ uri: item.uri }}
                                                />
                                            )
                                        } */}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    pagingEnabled
                                    bounces={false}
                                    keyExtractor={item => item.uri}
                                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                        { useNativeDriver: false }
                                    )}
                                    scrollEventThrottle={32}
                                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                                    viewabilityConfig={viewabilityConfig}
                                    ref={slidesRef}
                                />
                            </View>
                            <View style={styles.footerHolder}>
                                <Paginator data={images} scrollX={scrollX} scrollTo={scrollTo} />
                                <View style={styles.buttonsHolder}>
                                    <TouchableOpacity
                                        activeOpacity={0.75}
                                        style={[styles.button, { marginRight: 10, backgroundColor: theme.colors.red }]}
                                        onPress={deleteImage}
                                    >
                                        <MaterialIcons name="delete" style={styles.icon} />
                                        <Text style={styles.text}>Excluir</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.75}
                                        style={styles.button}
                                        onPress={() => {
                                            images.length >= 3 ? setErrorModalVisible(true) : setModalOpen(false)
                                        }}
                                    >
                                        <MaterialIcons name="add-a-photo" style={styles.icon} />
                                        <Text style={styles.text}>Adicionar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TextButton
                                title="Próximo passo"
                                colors={[theme.colors.secondary1, theme.colors.secondary2]}
                                buttonStyle={{ height: 45, width: "90%", marginBottom: 15, marginTop: 20 }}
                                onPress={AddImagesToData}
                            />
                        </View>
                    </View>
                </Modal>
                <TextButton
                    title={images.length === 0 ? "Aguardando imagens..." : "Próximo passo"}
                    colors={images.length === 0 ? [theme.colors.gray_light, theme.colors.gray_dark] : [theme.colors.secondary1, theme.colors.secondary2]}
                    disabled={images.length === 0 ? true : false}
                    buttonStyle={{ height: 45, width: "90%", marginBottom: 25 }}
                    onPress={AddImagesToData}
                />
            </View>
        </View>
    );
}