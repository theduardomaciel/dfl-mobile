import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Image, FlatList, SectionList, TouchableOpacity, RefreshControl } from "react-native";

import { ProfileIcon } from "../../components/ProfileIcon";
import { SectionTitle } from "../../components/SectionTitle";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

import TrashbinSvg from "../../assets/trashbin_2.svg"

import { useAuth } from "../../hooks/auth";

// Os dados em uma SectionList devem ser sempre organizados em: "Title" e "Data". 
// Se esse nomes não estiverem escritos, um erro será retornado.
const EXAMPLE_REPORTS = [
    {
        title: "14/08",
        data: [
            {
                id: "1312313",
                location: "Feitosa, Maceió - AL",
                description: "O contato com o proprietário se mostra urgente devido à situação do local.",
                image_url: "https://pbs.twimg.com/media/FJgrSipX0AIqJNk?format=png&name=240x240",
                solved: true
            },
            {
                id: "23426563",
                location: "1094 Rua Luiz Rizzo",
                description: "",
                image_url: "https://pbs.twimg.com/media/FJgrR-9XMAMxdb5?format=png&name=240x240",
                solved: false
            },
            {
                id: "1930257",
                location: "234 Tv. Escritor Paulino Santiago",
                description: "",
                image_url: "https://pbs.twimg.com/media/FJgrRhlWUAMUUfD?format=png&name=240x240",
                solved: false
            }
        ]
    }
]

const EXAMPLE_REPORTS2 = [
    {
        title: "18/09",
        data: [
            {
                id: "1312313",
                location: "Feitosa, Maceió - AL",
                description: "O contato com o proprietário se mostra urgente devido à situação do local.",
                image_url: "https://pbs.twimg.com/media/FJgrSipX0AIqJNk?format=png&name=240x240",
                solved: true
            },
        ]
    }
]

const SectionHeader = ({ section }: any) => (
    <SectionTitle
        title={section.title}
        color={theme.colors.primary1}
        fontStyle={{
            fontFamily: theme.fonts.subtitle900,
            color: theme.colors.primary1
        }}
    />
);

const SectionItem = ({ item }: any) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.report_container}
        >
            <View style={styles.report_info_container}>
                <SectionTitle
                    title={item.location}
                    color={theme.colors.primary1}
                    fontStyle={{
                        fontFamily: theme.fonts.subtitle900,
                        color: theme.colors.primary1
                    }}
                />
                <Text style={styles.report_description}>
                    {item.description ? item.description : "[nenhuma sugestão provida]"}
                </Text>
                <Text style={styles.report_data}>
                    {"Id do Relatório: " + item.id}
                    {item.solved ? <Text style={{ color: theme.colors.primary1 }}> | solucionado</Text> : <Text style={{ color: theme.colors.red }}> | não solucionado</Text>}
                </Text>
            </View>
            <Image
                style={styles.report_image}
                source={{
                    uri: item.image_url,
                }}
            />
        </TouchableOpacity>
    )
}

const EMPTY = []

const EmptyItem = ({ item }: any) => {
    return (
        <View style={styles.container}>
            <TrashbinSvg
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
                Que tal reportar um foco de lixo para que ele apareça aqui?
            </Text>
        </View>
    )
}

export function Account() {
    const { user } = useAuth();
    if (user === null) {
        return null;
    }
    const Header = () => {
        return (
            <View style={styles.header}>
                <View style={styles.userInfoContainer}>
                    <Text style={styles.title}>
                        {user.first_name + " " + user.last_name}
                    </Text>
                    <Text style={styles.username}>
                        @nomedousuário
                    </Text>
                </View>
                <ProfileIcon uri={user.image_url} openConfig />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Header />
            <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}

                refreshControl={
                    <RefreshControl
                        refreshing={false}
                    />
                }
            >
                { /* Histórico */}
                <SectionTitle title="Histórico" />
                <SectionList
                    nestedScrollEnabled={true}
                    style={[elements.subContainerWhite, { height: 375, marginBottom: 25 }]}
                    contentContainerStyle={styles.container}
                    // Configurações dos elementos do Relatório
                    //sections={[...EXAMPLE_REPORTS, ...EXAMPLE_REPORTS2]}
                    sections={EMPTY}
                    /* keyExtractor={(item, index)=>index.toString()} */
                    keyExtractor={item => item.id}
                    renderItem={SectionItem}
                    renderSectionHeader={SectionHeader}
                    renderSectionFooter={() => (
                        <View style={{ height: 10 }}></View>
                    )}
                    ListEmptyComponent={EmptyItem}
                // Faz com que o Header fique grudado no início: stickySectionHeadersEnabled
                />

                { /* Estatísticas */}
                <SectionTitle title="Relatórios" />
                <View style={[elements.subContainerGreen, { height: 325 }]}>

                </View>

                <View style={{ height: 25 }} />
            </ScrollView>
        </View>
    );
}