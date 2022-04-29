import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    FlatList,
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    Text,
    UIManager,
    View
} from "react-native";

import TrashBinSvg from "../../../assets/icons/trashbin.svg"
import { MaterialIcons } from "@expo/vector-icons"
import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";

import { Comment, Report } from "../../../@types/application";

import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../utils/api";

import { TextForm } from "../../../components/TextForm";
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

type Props = {
    width: string;
    report_id: number;
    commentsArray: Array<Comment>;
}

export function CommentsView({ width, report_id, commentsArray }: Props) {
    const { user } = useAuth();

    const [comments, setComments] = useState<Array<Comment>>(commentsArray)

    useEffect(() => {
        setComments(commentsArray)
    }, [commentsArray])

    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

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
        return (
            item.profile.id === user.profile.id ?
                <Pressable
                    style={{ flexDirection: "row", marginBottom: 10, width: width }}
                    onLongPress={() => {
                        actualComment.index = index
                        actualComment.id = item.id
                        setDeleteModalVisible(true)
                    }}
                    android_ripple={{ color: theme.colors.primary2 }} >
                    <View style={styles.profile_image}>
                        <Image
                            progressiveRenderingEnabled
                            style={{ flex: 1 }}
                            source={{
                                uri: item.profile.image_url,
                            }}
                        />
                    </View>
                    <View style={{ width: width, height: "100%" }}>
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
                <View style={{ flexDirection: "row", marginBottom: 10, width: width }}>
                    <View style={styles.profile_image}>
                        <Image
                            progressiveRenderingEnabled
                            style={{ flex: 1 }}
                            source={{
                                uri: item.profile.image_url,
                            }}
                        />
                    </View>
                    <View style={{ width: width, height: "100%" }}>
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
                comments.length === 0 &&
                <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "center", flex: 1 }}>
                    <TrashBinSvg
                        fill={theme.colors.secondary1}
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

    const nullOrZero = comments !== null ? comments.length === 0 : true
    return (
        <>
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
            <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                contentContainerStyle={nullOrZero && { height: "100%" }}
            >
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
                        nestedScrollEnabled={true}
                        windowSize={10}
                    />
                </View>
            </ScrollView>

            {
                comments !== null && user.profile &&
                <TextForm
                    customStyle={{ height: 40, width: width, marginTop: 15, marginBottom: 20 }}
                    textInputProps={{
                        placeholder: "Deixe um comentário",
                        maxLength: 150,
                        onChangeText: (text) => setCommentText(text),
                    }}
                    icon={uploadingComment ? <ActivityIndicator size={"small"} color={theme.colors.secondary1} /> : <MaterialIcons name="send" size={22} color={theme.colors.secondary1} />}
                    onIconPress={shareComment}
                    disabled={uploadingComment}
                    fontStyle={{ fontSize: 13 }}
                    children={
                        <View style={{
                            width: 12,
                            height: 12,
                            borderRadius: 12 / 2,
                            overflow: "hidden",
                            position: "absolute",
                            left: 10,
                            bottom: "50%"
                        }}>
                            <Image
                                progressiveRenderingEnabled
                                style={{ flex: 1 }}
                                source={{
                                    uri: user.profile.image_url,
                                }}
                            />
                        </View>
                    }
                />
            }
        </>
    );
}