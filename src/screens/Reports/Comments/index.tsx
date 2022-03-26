import React, { useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, LayoutAnimation, Platform, ScrollView, Text, UIManager, View, ViewToken } from "react-native";

import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";

import TrashBinSvg from "../../../assets/trashbin_2.svg"
import Modal from "react-native-modal"
import { TextForm } from "../../../components/TextForm";

import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../../../hooks/useAuth";
import { Comment, Report } from "../../../@types/application";
import { api } from "../../../utils/api";

type Props = {
    isVisible: any;
    closeFunction: () => void;
    report: Report;
}

export function CommentsModal({ isVisible, closeFunction, report }: Props) {
    const [reportObject, setReportObject] = useState(report)

    const { user, updateReport } = useAuth();

    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    const actualDate = new Date();
    const renderComment = ({ item, index }) => {
        const differenceTime = actualDate.getTime() - new Date(item.createdAt).getTime()
        const SECONDS = Math.floor(differenceTime / 1000)
        const MINUTES = Math.floor(SECONDS / 60)
        const HOURS = Math.floor(MINUTES / 60)
        let createdAtText = ""
        if (HOURS > 24) {
            createdAtText = `${Math.floor(HOURS / 24)} dias atrás`
        } else if (MINUTES >= 1) {
            createdAtText = `${MINUTES} minutos atrás`
        } else if (SECONDS < 60) {
            createdAtText = `${SECONDS} segundos atrás`
        } else {
            createdAtText = `${HOURS}h atrás`
        }
        return (
            <View style={{ flexDirection: "row", marginBottom: 10, width: "90%", overflow: "hidden" }}>
                <Image
                    source={{ uri: item.profile.image_url }}
                    style={{
                        overflow: "hidden",
                        resizeMode: "cover",
                        width: 40,
                        height: 40,
                        marginRight: 10,
                        borderRadius: 40 / 2,
                    }}
                />
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
            <View style={{ alignItems: "center", height: "100%", justifyContent: "center" }}>
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

    const [uploadingComment, setUploadingComment] = useState(false)
    const [commentText, setCommentText] = useState("")
    const shareComment = async () => {
        console.log("Adicionando comentário ao relatório.", commentText)
        setUploadingComment(true)

        // Atualizando objeto do relatório no banco de dados
        const commentResponse = await api.post("/report/comment/create", {
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

    return (
        <Modal
            testID={'modal'}
            isVisible={isVisible}
            onSwipeComplete={closeFunction}
            onBackdropPress={closeFunction}
            swipeDirection={['down']}
            style={styles.view}
            propagateSwipe
        >
            <View style={styles.container}>
                <View style={{
                    marginTop: 15,
                    marginBottom: 3,
                    backgroundColor: theme.colors.primary1,
                    width: "25%",
                    height: 3,
                    borderRadius: 5,
                    opacity: 0.5
                }} />
                <Text style={styles.title}>{`${report.comments.length} comentários`}</Text>
                <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={{ flex: 1 }} onStartShouldSetResponder={(): boolean => true}>
                        <FlatList
                            style={{ flex: 1 }}
                            data={report.comments}
                            contentContainerStyle={{ flex: 1 }}
                            renderItem={renderComment}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={EmptyItem}
                            showsVerticalScrollIndicator={false}
                            inverted
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
                    icon={uploadingComment ? <ActivityIndicator size={"small"} color={theme.colors.secondary1} /> : <MaterialIcons name="send" size={18} color={theme.colors.secondary1} />}
                    onIconPress={shareComment}
                    disabled={uploadingComment}
                    fontStyle={{ fontSize: 13 }}
                />
            </View>
        </Modal>
    );
}