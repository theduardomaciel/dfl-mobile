import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, UIManager, View, } from "react-native";

import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";

import Modal from "react-native-modal"

import { useAuth } from "../../../hooks/useAuth";
import { Comment } from "../../../@types/application";
import { api } from "../../../utils/api";
import { CommentsView } from ".";
import { UpdateNavigationBar } from "../../../utils/functions/UpdateNavigationBar";

async function GetReportComments(report_id) {
    try {
        const reportCommentsResult = await api.get(`report/${report_id}/comments"`)
        const reportComments = reportCommentsResult.data as Array<Comment>
        if (reportComments && reportComments.length > 0) {
            console.log("Há relatórios")
            return reportComments
        } else {
            console.log("Não há comentários para este relatório")
            return null
        }
    } catch (error) {
        console.log(error, "deu erro")
        return null
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
            UpdateNavigationBar("dark", true, theme.colors.background)
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
        } else {
            UpdateNavigationBar("dark", false, theme.colors.background)
        }
    }, [isVisible])

    const hasComments = comments !== undefined && comments !== null && comments.length !== 0 ? true : false;
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
                    height: "13%", width: "100%", alignItems: "center", backgroundColor: theme.colors.modalBackground, borderRadius: styles.container.borderTopLeftRadius
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
                        hasComments && <Text style={styles.title}>{`${comments.length} comentário${comments.length !== 1 ? 's' : ""}`}</Text>
                    }
                </View>
                <CommentsView width={"90%"} report_id={report_id} commentsArray={comments} />
            </KeyboardAvoidingView>
        </Modal>
    );
}