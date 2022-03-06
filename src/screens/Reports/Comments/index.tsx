import React, { useRef, useState } from "react";
import { FlatList, Image, Text, View, ViewToken } from "react-native";

import { styles } from "./styles";
import { theme } from "../../../global/styles/theme";

import TrashBinSvg from "../../../assets/trashbin_2.svg"
import Modal from "react-native-modal"
import { TextForm } from "../../../components/TextForm";

import { MaterialIcons } from "@expo/vector-icons"

type Props = {
    isVisible: any;
    closeFunction: () => void;
    reportComments: Array<{}>;
    user: any;
    report: any;
}

export function CommentsModal({ isVisible, closeFunction, reportComments, user, report }: Props) {
    const commentsAmount = reportComments.length;

    const FAKE_DATA = [
        {
            id: 0,
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis dictum suscipit. Mauris ac mollis urna. Vestibulum leo nunc, volutpat vel dignissim vel, varius eu ipsum. Vivamus vitae lorem in turpis feugiat rhoncus.",
            profile: user.profile,
            report: report,
            createdAt: "December 17, 1995 03:24:00"
        },
        {
            id: 1,
            content: "sdaodsijaodajsiadoaisj aspdk apokd spa dka opask pdpaok dsa ad",
            profile: user.profile,
            report: report,
            createdAt: "January 22, 2022 03:24:00"
        },
        {
            id: 2,
            content: "que legal!",
            profile: user.profile,
            report: report,
            createdAt: "March 05, 2022 16:24:00"
        },
        {
            id: 3,
            content: "que legal!",
            profile: user.profile,
            report: report,
            createdAt: "March 05, 2022 16:24:00"
        }
    ]

    const actualDate = new Date();
    const renderComment = ({ item, index }) => {
        const differenceTime = actualDate.getTime() - new Date(item.createdAt).getTime()
        const HOURS = Math.floor(((differenceTime / 1000) / 60) / 60)
        let createdAtText = ""
        if (HOURS > 24) {
            createdAtText = `${Math.floor(HOURS / 24)} dias atrás`
        } else {
            createdAtText = `${HOURS}h atrás`
        }
        console.log(item)
        return (
            <View style={{ flexDirection: "row", marginBottom: 10, width: "90%" }}>
                <Image
                    source={{ uri: item.profile.image_url }}
                    style={{
                        width: 35,
                        height: 35,
                        marginRight: 10,
                        borderRadius: 100,
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
            <View style={{ alignItems: "center" }}>
                <TrashBinSvg
                    width={50}
                    height={90}
                />
                <Text style={{
                    fontFamily: theme.fonts.title700,
                    color: theme.colors.secondary1,
                    fontSize: 18,
                    textAlign: "center"
                }}>
                    Está um pouco vazio aqui...
                </Text>
                <Text style={{
                    fontFamily: theme.fonts.subtitle400,
                    color: theme.colors.secondary1,
                    fontSize: 16,
                    textAlign: "center"
                }}>
                    Seja o primeiro a comentar para que seu comentário apareça aqui!
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
                <Text style={styles.title}>{`${commentsAmount} comentários`}</Text>
                <FlatList
                    data={FAKE_DATA}
                    renderItem={renderComment}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={EmptyItem}
                    showsVerticalScrollIndicator={false}
                />
                <TextForm
                    customStyle={{ height: 30, width: "90%", marginTop: 15, marginBottom: 25 }}
                    textInputProps={{
                        placeholder: "Deixe um comentário",
                        maxLength: 150
                    }}
                    icon={<MaterialIcons name="send" size={18} color={theme.colors.secondary1} />}
                    onIconPress={() => { console.log("ícone de enviar pressionado") }}
                    fontStyle={{ fontSize: 12 }}
                />
            </View>
        </Modal>
    );
}