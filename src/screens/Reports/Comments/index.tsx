import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, KeyboardAvoidingView, LayoutAnimation, Platform, Pressable, ScrollView, Text, UIManager, View, ViewToken } from "react-native";

import { initialWindowMetrics } from 'react-native-safe-area-context'

import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";

import TrashBinSvg from "../../../assets/trashbin_2.svg"
import Modal from "react-native-modal"
import { TextForm } from "../../../components/TextForm";

import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../../../hooks/useAuth";
import { Comment, Report } from "../../../@types/application";
import { api } from "../../../utils/api";
import { ModalBase } from "../../../components/ModalBase";
import { TextButton } from "../../../components/TextButton";

type Props = {
    isVisible: any;
    closeFunction: () => void;
    report: Report;
}

let actualComment = { id: 0, index: 0 }

function CalculateCommentCreatedAt(item) {
    const actualDate = new Date();
    const differenceTime = actualDate.getTime() - new Date(item.createdAt).getTime()
    const SECONDS = Math.floor(Math.abs(differenceTime) / 1000)
    const MINUTES = Math.floor(SECONDS / 60)
    const HOURS = Math.floor(MINUTES / 60)
    const DAYS = Math.floor(HOURS / 24)
    let createdAtText = ""
    if (HOURS > 24) {
        createdAtText = `${DAYS} dia${DAYS !== 1 ? "s" : ""} atrás`
    } else if (HOURS >= 1) {
        createdAtText = `${HOURS} hora${HOURS !== 1 ? "s" : ""} atrás`
    } else if (MINUTES >= 1) {
        createdAtText = `${MINUTES} minuto${MINUTES !== 1 ? "s" : ""} atrás`
    } else {
        createdAtText = `${SECONDS} segundo${SECONDS !== 1 ? "s" : ""} atrás`
    }
    return createdAtText;
}

import changeNavigationBarColor, {
    hideNavigationBar,
    showNavigationBar,
} from 'react-native-navigation-bar-color';

export function CommentsModal({ isVisible, closeFunction, report }: Props) {
    const [reportObject, setReportObject] = useState(report)

    const { user, updateReport } = useAuth();

    /* const { frame } = initialWindowMetrics
    const deviceWidth = Dimensions.get('window').width
    const deviceHeight = Platform.OS === 'ios' ? Dimensions.get('window').height : frame.height */

    useEffect(() => {
        setReportObject(report)
    }, [report])

    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
    const [isDeletingComment, setDeletingComment] = useState(false)
    const deleteComment = async () => {
        console.log("Excluindo comentário do relatório.")
        setDeletingComment(true)

        // Atualizando objeto do relatório no banco de dados
        await api.post("/report/comments/delete", { comment_id: actualComment.id })
        console.log("Comentário adicionado com sucesso no relatório.")

        // Atualizando objeto do relatório localmente
        let commentCopy = Object.assign(report.comments)
        console.log(actualComment.index)
        commentCopy.splice(actualComment.index, 1)
        const updatedReport = await updateReport(report, commentCopy, "comments")

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setReportObject(updatedReport)

        console.log("Relatório local atualizado com o comentário removido.")
        setDeleteModalVisible(false)
        setDeletingComment(false)
    }

    const [uploadingComment, setUploadingComment] = useState(false)
    const [commentText, setCommentText] = useState("")
    const shareComment = async () => {
        if (commentText.length < 1) return;
        console.log("Adicionando comentário ao relatório com a seguinte mensagem: ", commentText)
        setUploadingComment(true)

        // Atualizando objeto do relatório no banco de dados
        const commentResponse = await api.post("/report/comments/create", {
            profile_id: user.profile.id,
            profile_username: user.profile.username,
            report_id: report.id,
            content: commentText
        })
        const comment = commentResponse.data as Comment;
        console.log("Comentário adicionado com sucesso no relatório.", comment)

        // Atualizando objeto do relatório localmente
        let commentCopy = Object.assign(report.comments)
        commentCopy.push(comment)
        const updatedReport = await updateReport(report, commentCopy, "comments")

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setReportObject(updatedReport)

        console.log("Relatório local atualizado com o comentário adicionado.")

        setUploadingComment(false)
    }

    const renderComment = ({ item, index }) => {
        const createdAtText = CalculateCommentCreatedAt(item)
        return (
            item.profile.id === user.profile.id ?
                <Pressable style={{ flexDirection: "row", marginBottom: 10, width: "90%" }} onLongPress={() => {
                    actualComment.index = index
                    actualComment.id = item.id
                    setDeleteModalVisible(true)
                }} android_ripple={{ color: theme.colors.primary2 }} >
                    <View style={styles.profile_image}>
                        <Image
                            progressiveRenderingEnabled
                            style={{ flex: 1 }}
                            source={{
                                uri: item.profile.image_url,
                            }}
                        />
                    </View>
                    <View style={{ width: "90%", height: "100%" }}>
                        <Text style={styles.usernameText}>
                            {item.profile.username}
                        </Text>
                        <Text style={styles.commentText}>
                            {item.content}
                        </Text>
                        <Text style={styles.createdAtText}>
                            {createdAtText}
                        </Text>
                    </View>
                </Pressable>
                :
                <View style={{ flexDirection: "row", marginBottom: 10, width: "90%" }}>
                    <View style={styles.profile_image}>
                        <Image
                            progressiveRenderingEnabled
                            style={{ flex: 1 }}
                            source={{
                                uri: item.profile.image_url,
                            }}
                        />
                    </View>
                    <View style={{ width: "90%", height: "100%" }}>
                        <Text style={styles.usernameText}>
                            {item.profile.username}
                        </Text>
                        <Text style={styles.commentText}>
                            {item.content}
                        </Text>
                        <Text style={styles.createdAtText}>
                            {createdAtText}
                        </Text>
                    </View>
                </View>
        )
    }

    const EmptyItem = () => {
        return (
            <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", flex: 1, backgroundColor: "transparent" }}>
                <TrashBinSvg
                    width={40}
                    height={80}
                />
                <Text style={{
                    fontFamily: theme.fonts.title700,
                    color: theme.colors.secondary1,
                    fontSize: 18,
                    textAlign: "center",
                }}>
                    Está um pouco vazio aqui...
                </Text>
                <Text style={{
                    fontFamily: theme.fonts.subtitle400,
                    color: theme.colors.secondary1,
                    fontSize: 16,
                    textAlign: "center",
                }}>
                    {`Seja o primeiro a comentar para que seu\ncomentário apareça aqui!`}
                </Text>
            </View>
        )
    }

    return (
        <Modal
            testID={'modal'}
            isVisible={isVisible}
            onSwipeComplete={closeFunction}
            onBackdropPress={closeFunction}
            swipeDirection={['down']}
            style={styles.view}
            propagateSwipe
            avoidKeyboard
            statusBarTranslucent // tirando isso, o teclado funciona de boa
        >
            <ModalBase
                isVisible={isDeleteModalVisible}
                onBackdropPress={() => { }}
                title={"Tem certeza que deseja deletar o comentário?"}
                description={"Essa ação não poderá ser desfeita."}
                children={
                    isDeletingComment ?
                        <View style={{ flex: 1 }}>
                            <ActivityIndicator size={"small"} color={theme.colors.primary1} />
                        </View>
                        :
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TextButton
                                title="CANCELAR"
                                buttonStyle={{ backgroundColor: theme.colors.red_light, paddingVertical: 10, paddingHorizontal: 15, marginRight: 10 }}
                                onPress={() => {
                                    setDeleteModalVisible(false)
                                }}
                            />
                            <TextButton
                                title="CONTINUAR"
                                buttonStyle={{ paddingVertical: 10, paddingHorizontal: 15 }}
                                onPress={deleteComment}
                            />
                        </View>
                }
                toggleModal={() => { setDeleteModalVisible(!isDeleteModalVisible) }}
            />
            <KeyboardAvoidingView behavior='padding' pointerEvents='box-none' style={[styles.container, { margin: 0, flex: 0.35, justifyContent: 'center' }]}>
                <View style={{
                    marginTop: 15,
                    marginBottom: 3,
                    backgroundColor: theme.colors.primary1,
                    width: "25%",
                    height: 3,
                    borderRadius: 5,
                    opacity: 0.5
                }} />
                <Text style={styles.title}>{`${reportObject.comments.length} comentário${reportObject.comments.length !== 1 ? 's' : ""}`}</Text>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={reportObject.comments.length === 0 && { height: "100%" }} >
                    <View style={{ flex: 1 }} onStartShouldSetResponder={(): boolean => true}>
                        <FlatList
                            style={{ flex: 1 }}
                            data={reportObject.comments.sort(function (x, y) {
                                const date1 = new Date(x.createdAt) as any;
                                const date2 = new Date(y.createdAt) as any;
                                return date2 - date1;
                            })}
                            contentContainerStyle={{ flex: 1 }}
                            renderItem={renderComment}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={EmptyItem}
                            showsVerticalScrollIndicator={false}
                            windowSize={10}
                        />
                    </View>
                </ScrollView>

                <TextForm
                    customStyle={{ height: 40, width: "90%", marginTop: 15, marginBottom: 20 }}
                    textInputProps={{
                        placeholder: "Deixe um comentário",
                        maxLength: 150,
                        onChangeText: (text) => setCommentText(text),
                    }}
                    icon={uploadingComment ? <ActivityIndicator size={"small"} color={theme.colors.secondary1} /> : <MaterialIcons name="send" size={22} color={theme.colors.secondary1} />}
                    onIconPress={shareComment}
                    disabled={uploadingComment}
                    fontStyle={{ fontSize: 13 }}
                />
            </KeyboardAvoidingView>
        </Modal>
    );
}