import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Linking } from 'react-native';

import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import { MaterialIcons } from "@expo/vector-icons"
import TrashbinIcon from "../../../assets/icons/trashbin.svg";

import { theme } from '../../../global/styles/theme';
import { actionButtonsMargin, paddingHorizontal, styles } from './modalStyles';

import { Profile, Report } from '../../../@types/application';

import { LoadingScreen } from '../../../components/LoadingScreen';
import GetRatingsAverage from '../../../utils/functions/GetRatingsAverage';
import { shareReport } from '../../Reports';
import { CommentsView } from '../../Reports/Comments';

import { ScrollView, NativeViewGestureHandler } from 'react-native-gesture-handler';

import { Portal } from 'react-native-portalize';
import RatingFrame from '../../Reports/RatingFrame';

const Bold = (props) => <Text style={{ fontFamily: theme.fonts.title700 }}>{props.children}</Text>

type Props = {
    report: Report;
    profile: Profile;
    setRating: React.Dispatch<React.SetStateAction<number>>;
    handleSheetChanges: (index: number) => Promise<void>;
}

export const FocusModal = React.forwardRef((props: Props, ref) => {
    const report = props.report;
    const profile = props.profile;

    if (!report) {
        console.log(report)
        return <View></View>
    }

    // variables
    const snapPoints = useMemo(() => ['50%', '75%'], []);

    const [ratingBarHeight, setRatingBarHeight] = useState(0)
    const [commentsPositionY, setCommentsPositionY] = useState(0)
    const [ratingsPositionY, setRatingsPositionY] = useState(0)

    const [isLoading, setIsLoading] = useState(false)

    const totalRatings = report.note1 + report.note2 + report.note3 + report.note4 + report.note5
    const note1Width = report.note1 > 0 ? (report.note1 * 100) / totalRatings : 5
    const note2Width = report.note2 > 0 ? (report.note2 * 100) / totalRatings : 5
    const note3Width = report.note3 > 0 ? (report.note3 * 100) / totalRatings : 5
    const note4Width = report.note4 > 0 ? (report.note4 * 100) / totalRatings : 5
    const note5Width = report.note5 > 0 ? (report.note5 * 100) / totalRatings : 5

    const parsedCoordinates = {
        latitude: parseFloat(report.coordinates[0]),
        longitude: parseFloat(report.coordinates[1])
    }

    const ratingsAverage = useMemo(() => GetRatingsAverage(report), [report])
    const scrollVieWRef = React.useRef<ScrollView>(null);

    const image1Width = report.images_urls.length > 1 ? "49%" : "100%"

    return (
        <Portal>
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={ref as any}
                    index={0}
                    enablePanDownToClose
                    overDragResistanceFactor={1.5}
                    snapPoints={snapPoints}
                    onChange={props.handleSheetChanges}
                >
                    <ScrollView ref={scrollVieWRef} showsVerticalScrollIndicator={false}>
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
                                    {ratingsAverage}
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
                                        progressiveRenderingEnabled
                                        source={{ uri: report.profile && report.profile.image_url }}
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
                                onPress={() => {
                                    console.log("Descendo até a área de comentários.")
                                    scrollVieWRef.current?.scrollTo({ x: 0, y: commentsPositionY, animated: true })
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
                                onPress={() => {
                                    console.log("Descendo até a área de avaliações.")
                                    scrollVieWRef.current?.scrollTo({ x: 0, y: ratingsPositionY, animated: true })
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
                                progressiveRenderingEnabled
                                loadingIndicatorSource={{ uri: "/src/assets/icon/loading_icon.gif" }}
                                source={{ uri: report.images_urls[0] }}
                                style={[styles.image, { width: image1Width }]}
                            />
                            {
                                report.images_urls.length > 1 &&
                                    report.images_urls.length > 2 ?
                                    <View style={styles.imagesHolder}>
                                        <Image
                                            loadingIndicatorSource={{ uri: "/src/assets/icon/loading_icon.gif" }}
                                            progressiveRenderingEnabled
                                            source={{ uri: report.images_urls[1] }}
                                            style={[styles.image, { width: "100%", height: "49%" }]}
                                        />
                                        <Image
                                            progressiveRenderingEnabled
                                            loadingIndicatorSource={{ uri: "/src/assets/icon/loading_icon.gif" }}
                                            source={{ uri: report.images_urls[2] }}
                                            style={[styles.image, { width: "100%", height: "49%" }]}
                                        />
                                    </View>
                                    :
                                    <Image
                                        progressiveRenderingEnabled
                                        loadingIndicatorSource={{ uri: "/src/assets/icon/loading_icon.gif" }}
                                        source={{ uri: report.images_urls[1] }}
                                        style={[styles.image, { width: "49%" }]}
                                    />
                            }
                        </View>
                        {/* Suggestion */}
                        {
                            report.suggestion !== "" &&
                            <View style={[styles.padding, { marginBottom: 10 }]}>
                                <Text style={styles.subTitle}>
                                    <Bold>Sugestão de @{`${report.profile.username}`}</Bold>
                                </Text>
                                <Text style={styles.subTitle}>
                                    {report.suggestion}
                                </Text>
                            </View>
                        }
                        {/* Ratings */}
                        <View style={[styles.padding, { marginBottom: 15 }]}>
                            <Text style={styles.sectionTitle}>
                                Resumo das avaliações
                            </Text>
                            <View style={styles.subContainer}>
                                <View style={{ alignItems: "center", width: "30%" }}>
                                    <Text style={styles.ratingMedium}>
                                        {ratingsAverage}
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
                                        <View style={[styles.ratingLineFilled, { width: note1Width, height: ratingBarHeight }]} />
                                    </View>
                                    <View style={styles.ratingLine}>
                                        <View style={[styles.ratingLineFilled, { width: note2Width, height: ratingBarHeight }]} />
                                    </View>
                                    <View style={styles.ratingLine}>
                                        <View style={[styles.ratingLineFilled, { width: note3Width, height: ratingBarHeight }]} />
                                    </View>
                                    <View style={styles.ratingLine}>
                                        <View style={[styles.ratingLineFilled, { width: note4Width, height: ratingBarHeight }]} />
                                    </View>
                                    <View style={styles.ratingLine}>
                                        <View style={[styles.ratingLineFilled, { width: note5Width, height: ratingBarHeight }]} />
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
                                            uri: profile.image_url,
                                        }}
                                    />
                                </View>
                                <View style={{ paddingVertical: 5, paddingHorizontal: 50 }}>
                                    <RatingFrame setRating={props.setRating} />
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
                    </ScrollView>
                </BottomSheetModal >
            </BottomSheetModalProvider>
            {
                isLoading && <LoadingScreen />
            }
        </Portal >
    )
});