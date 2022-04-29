import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, Platform, Linking } from "react-native";

import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";

import { theme } from "../../../../global/styles/theme";

import { actionButtonsMargin, paddingHorizontal, styles, triangleSize } from "../modalStyles"

import TrashbinIcon from "../../../../assets/icons/trashbin.svg"
import { MaterialIcons } from "@expo/vector-icons"

import { Modalize } from "react-native-modalize";
import { Portal } from 'react-native-portalize';

import { styles as ratingStyles } from "../../../Reports/styles";
import MapView, { Marker } from "react-native-maps";
import { Report, User } from "../../../../@types/application";
import { GetRatingsAverage, shareReport } from "../../../Reports";
import { LoadingScreen } from "../../../../components/LoadingScreen";
import { CommentsView } from "../../../Reports/Comments";

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const Bold = (props) => <Text style={{ fontFamily: theme.fonts.title700 }}>{props.children}</Text>

const dimensions = Dimensions.get("screen")

const snapPoint = (50 / 100) * dimensions.height
const modalSize = (95 / 100) * dimensions.height

type Props = {
    modalizeRef: React.MutableRefObject<Modalize>;
    markerRef: React.MutableRefObject<Marker>;
    mapRef: React.MutableRefObject<MapView>;
    report: Report;
    user: User;
}

import { styles as reportStyles } from "../../../Reports/styles"

export function FocusModal({ modalizeRef, markerRef, mapRef, report, user }: Props) {

    if (user.profile === null) {
        return <View></View>
    }

    const [ratingBarHeight, setRatingBarHeight] = useState(0)
    const [commentsPositionY, setCommentsPositionY] = useState(0)
    const [ratingsPositionY, setRatingsPositionY] = useState(0)

    const [isLoading, setIsLoading] = useState(false)

    const totalRatings = report.note1 + report.note2 + report.note3 + report.note4 + report.note5
    const parsedCoordinates = {
        latitude: parseFloat(report.coordinates[0]),
        longitude: parseFloat(report.coordinates[1])
    }

    const contentRef = useRef<ScrollView>(null);

    const offset = useSharedValue(0);
    const ratingSelectorAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: offset.value,
                },
            ],
        };
    });

    const [rating, setRating] = useState(0)

    const INITIAL_OFFSET = -5
    const POSITION_OFFSET = (70 / 100) * dimensions.width / 5
    const POSITIONS = [
        INITIAL_OFFSET,
        INITIAL_OFFSET + POSITION_OFFSET,
        INITIAL_OFFSET + POSITION_OFFSET * 2,
        INITIAL_OFFSET + POSITION_OFFSET * 3,
        INITIAL_OFFSET + POSITION_OFFSET * 4
    ]

    const _onPanGestureEvent = (event, setRating) => {
        //O único problema do uso do translationX é que caso o usuário queria trocar seu rating, a animação terá que começar do início
        const nativeEvent = event.nativeEvent;
        const POSITION_X = nativeEvent.translationX // Quanta distância foi percorrida desde o início da animação
        const DISTANCE = (-POSITION_OFFSET / 2) - 15

        const ANIMATION_CONFIG = {
            damping: 5,
            stiffness: 65,
            mass: 0.1,
        }
        if (POSITION_X < DISTANCE && POSITION_X > DISTANCE * 2) {
            console.log("Dedo está no 2")
            offset.value = withSpring(-POSITIONS[1] + 5, ANIMATION_CONFIG)
            setRating(2)
        } else if (POSITION_X < DISTANCE * 2 && POSITION_X > DISTANCE * 3) {
            console.log("Dedo está no 3")
            offset.value = withSpring(-POSITIONS[2] + 10, ANIMATION_CONFIG)
            setRating(3)
        } else if (POSITION_X < DISTANCE * 3 && POSITION_X > DISTANCE * 4) {
            console.log("Dedo está no 4")
            offset.value = withSpring(-POSITIONS[3] + 15, ANIMATION_CONFIG)
            setRating(4)
        } else if (POSITION_X < DISTANCE * 4) {
            console.log("Dedo está no 5")
            offset.value = withSpring(-POSITIONS[4] + 15, ANIMATION_CONFIG)
            setRating(5)
        } else {
            console.log("Dedo está no 1")
            offset.value = withSpring(0, ANIMATION_CONFIG)
            setRating(1)
        }
    }

    return (
        <Portal>
            <Modalize
                ref={modalizeRef}
                snapPoint={snapPoint}
                handlePosition={"inside"}
                modalHeight={modalSize}
                avoidKeyboardLikeIOS
                contentRef={contentRef}
                velocity={4500}
                withOverlay={false}
                closeSnapPointStraightEnabled={false}
                handleStyle={styles.handle}
                onClose={async () => {
                    markerRef.current?.hideCallout()
                    const camera = await mapRef.current?.getCamera();
                    camera.center = {
                        latitude: parseFloat(report.coordinates[0]) + (0.005 / 2),
                        longitude: parseFloat(report.coordinates[1])
                    }
                    camera.zoom = 14
                    mapRef.current?.animateCamera(camera, { duration: 1000 })
                }}
            >
                {/* Header */}
                <View style={styles.padding}>
                    <View style={[styles.subContainer, { justifyContent: "space-between", marginTop: 25 }]}>
                        <Text style={styles.title}>
                            {report.address}
                        </Text>
                        <MaterialIcons name="more-vert" color={theme.colors.primary3} size={24} />
                    </View>
                    <View style={[styles.subContainer, { marginBottom: 5 }]}>
                        <TrashbinIcon fill={theme.colors.primary3} width={18} height={18} />
                        <Text style={styles.info}>
                            {GetRatingsAverage(report)}
                        </Text>
                        <Text style={styles.subInfo}>
                            {` (${totalRatings})`}
                        </Text>
                    </View>
                    <View style={[styles.subContainer, { alignItems: "center", justifyContent: "flex-start", marginBottom: 10 }]}>
                        <Text style={[styles.subTitle, { marginRight: 5 }]}>
                            Relatório
                        </Text>
                        <View style={{ width: 4, height: 4, backgroundColor: theme.colors.secondary1, borderRadius: 8 / 2, marginRight: 5 }} />
                        <View style={{
                            width: 18,
                            height: 18,
                            borderRadius: 18 / 2,
                            overflow: "hidden",
                            marginRight: 5
                        }}>
                            <Image
                                source={{ uri: report.profile.image_url }}
                                style={{
                                    flex: 1
                                }}
                            />
                        </View>
                        <Text style={styles.subTitle}>
                            {`postado por @`}<Bold>{`${report.profile.username}`}</Bold>
                        </Text>
                    </View>
                </View>
                {/* ActionButtons */}
                <ScrollView style={{ marginLeft: paddingHorizontal, marginBottom: 15 }} horizontal showsHorizontalScrollIndicator={false} >
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary3, borderWidth: 0 }]}
                        activeOpacity={0.75}
                        onPressOut={() => {
                            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                            const latLng = `${parsedCoordinates.latitude},${parsedCoordinates.longitude}`;
                            const label = report.address;
                            const url = Platform.select({
                                ios: `${scheme}${label}@${latLng}`,
                                android: `${scheme}${latLng}(${label})`
                            });
                            console.log('Visitando local no Google Maps')
                            try {
                                Linking.openURL(url);
                            } catch (error) {
                                console.log(error)
                            }
                        }}
                    >
                        <MaterialIcons name="directions" size={18} color={theme.colors.text1} style={{ marginRight: actionButtonsMargin }} />
                        <Text style={[styles.actionButtonText, { color: theme.colors.text1 }]}>
                            Rotas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        activeOpacity={0.75}
                        onPressOut={() => {
                            contentRef.current?.getScrollResponder().scrollResponderScrollTo({ y: commentsPositionY, animated: true })
                        }}
                    >
                        <MaterialIcons name="comment" size={18} color={theme.colors.primary3} style={{ marginRight: actionButtonsMargin }} />
                        <Text style={styles.actionButtonText}>
                            Comentários
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        activeOpacity={0.75}
                        onPressOut={() => {
                            contentRef.current?.getScrollResponder().scrollResponderScrollTo({ y: ratingsPositionY, animated: true })
                        }}
                    >
                        <TrashbinIcon fill={theme.colors.primary3} width={18} height={18} />
                        <Text style={styles.actionButtonText}>
                            Avaliar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        activeOpacity={0.75}
                        onPressOut={() => shareReport(setIsLoading, report)}
                    >
                        <MaterialIcons name="share" size={18} color={theme.colors.primary3} style={{ marginRight: actionButtonsMargin }} />
                        <Text style={styles.actionButtonText}>
                            Compartilhar
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                {/* Images */}
                <View style={[styles.subContainer, { justifyContent: "space-between", marginBottom: 15 }, styles.padding]}>
                    <Image
                        source={{ uri: report.image_url }}
                        style={styles.image1}
                    />
                    <Image
                        source={{ uri: report.image_url }}
                        style={styles.image2}
                    />
                </View>
                {/* Suggestion */}
                <View style={[styles.padding, { marginBottom: 10 }]}>
                    <Text style={styles.subTitle}>
                        <Bold>Sugestão de @{`${report.profile.username}`}</Bold>
                    </Text>
                    <Text style={styles.subTitle}>
                        {report.suggestion}
                    </Text>
                </View>
                {/* Ratings */}
                <View style={[styles.padding, { marginBottom: 15 }]}>
                    <Text style={styles.sectionTitle}>
                        Resumo das avaliações
                    </Text>
                    <View style={styles.subContainer}>
                        <View style={{ alignItems: "center", width: "30%" }}>
                            <Text style={styles.ratingMedium}>
                                {GetRatingsAverage(report)}
                            </Text>
                            <Text style={styles.ratingTotal}>
                                {`(${totalRatings})`}
                            </Text>
                        </View>
                        <View style={[{ width: "70%" }, styles.ratingsLinesContainer]}>
                            <View style={styles.ratingLine} onLayout={(event) => {
                                const { x, y, width, height } = event.nativeEvent.layout;
                                setRatingBarHeight(height)
                            }}>
                                <View style={[styles.ratingLineFilled, { width: (report.note1 * 100) / totalRatings, height: ratingBarHeight }]} />
                            </View>
                            <View style={styles.ratingLine}>
                                <View style={[styles.ratingLineFilled, { width: (report.note2 * 100) / totalRatings, height: ratingBarHeight }]} />
                            </View>
                            <View style={styles.ratingLine}>
                                <View style={[styles.ratingLineFilled, { width: (report.note3 * 100) / totalRatings, height: ratingBarHeight }]} />
                            </View>
                            <View style={styles.ratingLine}>
                                <View style={[styles.ratingLineFilled, { width: (report.note4 * 100) / totalRatings, height: ratingBarHeight }]} />
                            </View>
                            <View style={styles.ratingLine}>
                                <View style={[styles.ratingLineFilled, { width: (report.note5 * 100) / totalRatings, height: ratingBarHeight }]} />
                            </View>
                        </View>
                    </View>
                </View>
                {/* Rate */}
                <View style={[styles.padding, { marginBottom: 15 }]} onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    setRatingsPositionY(y)
                }}>
                    <Text style={styles.sectionTitle}>
                        Avaliação
                    </Text>
                    <View style={[styles.subContainer, { alignItems: "center", justifyContent: "space-between" }]}>
                        <View style={styles.bigProfileIcon}>
                            <Image
                                progressiveRenderingEnabled
                                style={{ flex: 1 }}
                                source={{
                                    uri: user.profile.image_url,
                                }}
                            />
                        </View>
                        <View style={[ratingStyles.ratingContainer, { width: "70%", height: "75%" }]}>
                            <Text style={ratingStyles.ratingPlaceholder}>5</Text>
                            <Text style={ratingStyles.ratingPlaceholder}>4</Text>
                            <Text style={ratingStyles.ratingPlaceholder}>3</Text>
                            <Text style={ratingStyles.ratingPlaceholder}>2</Text>
                            <Text style={ratingStyles.ratingPlaceholder}>1</Text>
                            <PanGestureHandler onGestureEvent={(event) => _onPanGestureEvent(event, setRating)}>
                                <Animated.View style={[reportStyles.ratingRound, ratingSelectorAnimatedStyle]}>
                                    <View style={[reportStyles.buttonCircle, { backgroundColor: theme.colors.primary1, width: 50, height: 50, opacity: 1 }]} />
                                </Animated.View>
                            </PanGestureHandler>
                        </View>
                    </View>
                </View>

                {/* Comments */}
                <ScrollView style={[styles.padding]} onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    setCommentsPositionY(y)
                }}>
                    <Text style={styles.sectionTitle}>
                        {`Comentários (${report.comments.length})`}
                    </Text>
                    <CommentsView width="100%" report_id={report.id} commentsArray={report.comments} />
                </ScrollView>
            </Modalize>
            {
                isLoading && <LoadingScreen />
            }
        </Portal>
    )
}