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

async function GetProfileComments(report_id) {
    const profileCommentsResult = await api.post("/report/comments/read", { report_id: report_id })
    const profileComments = profileCommentsResult.data as Array<Comment>
    return profileComments
}

type Props = {
    isVisible: any;
    closeFunction: () => void;
    report_id: number;
}

export function CommentsModal({ isVisible, closeFunction, report_id }: Props) {
    const { user } = useAuth();

    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    const [comments, setComments] = useState<Array<Comment> | null>(null)
    useEffect(() => {
        setComments(null)
        async function GetComments() {
            if (!report_id) return console.log("Um ID de relatório não foi fornecido.")
            console.log("Obtendo comentários do relatório de ID: ", report_id)
            const commentsArray = await GetProfileComments(report_id)
            setComments(commentsArray)
        }
        GetComments()
    }, [report_id])

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
    const [isDeletingComment, setDeletingComment] = useState(false)
    const deleteComment = async () => {
        console.log(`Excluindo comentário de ID: ${actualComment.id} da array de comentários.`)
        setDeletingComment(true)

        // Atualizando objeto do relatório no banco de dados
        await api.post("/report/comments/delete", { comment_id: actualComment.id })

        // Atualizando array de comentários localmente
        let commentsCopy = Object.assign(comments)
        commentsCopy.splice(actualComment.index, 1)

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setComments(commentsCopy)

        console.log("Comentário removido com sucesso no relatório.")
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
            report_id: report_id,
            content: commentText
        })
        const comment = commentResponse.data as Comment;

        // Atualizando objeto do relatório localmente
        let commentsCopy = Object.assign(comments)
        commentsCopy.push(comment)

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setComments(commentsCopy)

        console.log("Comentário adicionado com sucesso no relatório.", comment)
        setUploadingComment(false)
    }

    const renderComment = ({ item, index }) => {
        const createdAtText = CalculateCommentCreatedAt(item)
        //console.log(item.profile)
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
            comments === null ?
                <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", flex: 1 }}>
                    <ActivityIndicator size={"large"} color={theme.colors.secondary1} />
                </View>
                :
                <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", flex: 1 }}>
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

    const nullOrZero = comments === null ? true : comments.length === 0 ? true : false
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
                        <View style={{ flexDirection: "row" }}>
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
            <KeyboardAvoidingView
                behavior='padding'
                pointerEvents='box-none'
                style={[styles.container, { margin: 0, flex: 0.45, justifyContent: 'center' }]}>
                <View style={{
                    marginTop: 15,
                    marginBottom: 3,
                    backgroundColor: theme.colors.primary1,
                    width: "25%",
                    height: 3,
                    borderRadius: 5,
                    opacity: 0.5
                }} />
                {
                    !nullOrZero && <Text style={styles.title}>{`${comments.length} comentário${comments.length !== 1 ? 's' : ""}`}</Text>
                }
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={nullOrZero && { height: "100%" }} >
                    <View style={{ flex: 1 }} onStartShouldSetResponder={(): boolean => true}>
                        <FlatList
                            style={{ flex: 1 }}
                            data={comments !== null && comments.sort(function (x, y) {
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

                {
                    !nullOrZero &&
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
                }
            </KeyboardAvoidingView>
        </Modal>
    );
}