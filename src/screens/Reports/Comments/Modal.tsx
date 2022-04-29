import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, LayoutAnimation, Platform, Pressable, ScrollView, StatusBar, Text, UIManager, View, ViewToken } from "react-native";

import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";

import TrashBinSvg from "../../../assets/icons/trashbin.svg"
import Modal from "react-native-modal"
import { TextForm } from "../../../components/TextForm";

import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../../../hooks/useAuth";
import { Comment, Report } from "../../../@types/application";
import { api } from "../../../utils/api";
import { ModalBase } from "../../../components/ModalBase";
import { TextButton } from "../../../components/TextButton";
import { CommentsView } from ".";

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

async function GetReportComments(report_id) {
    try {
        const reportCommentsResult = await api.post("/report/comments/read", { report_id: report_id })
        const reportComments = reportCommentsResult.data as Array<Comment>
        return reportComments
    } catch (error) {
        console.log(error)
    }
}

type Props = {
    isVisible: any;
    closeFunction: () => void;
    report_id: number;
}

let last_report_id = 0

export function CommentsModal({ isVisible, closeFunction, report_id }: Props) {
    const { user } = useAuth();

    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    const [comments, setComments] = useState<Array<Comment> | null>(null)

    useEffect(() => {
        // Estou fazendo com que os comentários sejam carregados novamente a cada abertura do modal de comentários para teste,
        // entretanto, isso não é necessário.
        if (isVisible === true) {
            // Caso o modal de relatórios atual seja diferente do anterior, limpamos os resultados
            if (last_report_id !== report_id) setComments(null);
            async function GetComments() {
                if (!report_id) return console.log("Um ID de relatório não foi fornecido.")
                console.log("Obtendo comentários do relatório de ID: ", report_id)
                const commentsArray = await GetReportComments(report_id)
                setComments(commentsArray)
                last_report_id = report_id
            }
            GetComments()
        }
    }, [isVisible])

    const nullOrZero = comments !== null ? comments.length === 0 : true
    return (
        <Modal
            isVisible={isVisible}
            onSwipeComplete={closeFunction}
            onBackdropPress={closeFunction}
            swipeDirection={['down']}
            style={styles.view}
            hardwareAccelerated
            propagateSwipe={true}
            avoidKeyboard={true}
        >
            <KeyboardAvoidingView
                behavior='height'
                pointerEvents='box-none'
                style={[styles.container, { margin: 0, flex: 0.5, justifyContent: 'flex-start' }]}
            >
                <View style={{
                    height: "13%", width: "100%", alignItems: "center",
                }}>
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
                </View>
                <CommentsView width={"90%"} report_id={report_id} commentsArray={comments} />
            </KeyboardAvoidingView>
        </Modal>
    );
}