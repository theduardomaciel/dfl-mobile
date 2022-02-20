import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, Image, FlatList, SectionList, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";

import { ProfileIcon } from "../../components/ProfileIcon";
import { SectionTitle } from "../../components/SectionTitle";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

import TrashbinSvg from "../../assets/trashbin_2.svg"

import { useAuth } from "../../hooks/auth";
import { api } from "../../services/api";
import { response } from "express";

// Os dados em uma SectionList devem ser sempre organizados em: "Title" e "Data". 
// Se esse nomes não estiverem escritos, um erro será retornado.
const EXAMPLE_REPORTS = [
    {
        title: "14/08",
        data: [
            {
                id: "1312313",
                address: "Feitosa, Maceió - AL",
                suggestion: "O contato com o proprietário se mostra urgente devido à situação do local.",
                image_url: "https://pbs.twimg.com/media/FJgrSipX0AIqJNk?format=png&name=240x240",
                solved: true
            },
            {
                id: "23426563",
                address: "1094 Rua Luiz Rizzo",
                suggestion: "",
                image_url: "https://pbs.twimg.com/media/FJgrR-9XMAMxdb5?format=png&name=240x240",
                solved: false
            },
            {
                id: "1930257",
                address: "234 Tv. Escritor Paulino Santiago",
                suggestion: "",
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
                address: "Feitosa, Maceió - AL",
                suggestion: "O contato com o proprietário se mostra urgente devido à situação do local.",
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
        hasLine
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
                    marginBottom={1}
                    title={item.address}
                    color={theme.colors.primary1}
                    hasLine
                    fontStyle={{
                        fontFamily: theme.fonts.subtitle500,
                        color: theme.colors.primary1,
                        fontSize: 14
                    }}
                />
                <Text style={styles.report_description}>
                    {item.suggestion ? item.suggestion : "[nenhuma sugestão provida]"}
                </Text>
                <Text style={styles.report_data}>
                    {"Id do relatório: " + item.id}
                    {item.solved ? <Text style={{ color: theme.colors.primary1 }}> | solucionado</Text> : <Text style={{ color: theme.colors.red }}> | não solucionado</Text>}
                </Text>
            </View>
            <Image
                style={styles.report_image}
                source={{
                    uri: item.image_url
                }}
            />
        </TouchableOpacity>
    )
}

const EMPTY = []

const EmptyItem = ({ item }: any) => {
    return (
        <View style={[styles.container, { alignItems: "center", justifyContent: "center", alignSelf: "center" }]}>
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

    // Código original: https://stackoverflow.com/questions/46802448/how-do-i-group-items-in-an-array-by-date
    const [reportsData, setReportsData] = useState(null)
    async function LoadUserReports() {
        const data = user.reports;
        const groups = data.reduce((groups, report) => {
            const date = report.createdAt.split('T')[0];
            const dateSplit = date.split('-')
            const title = dateSplit[2] + "/" + dateSplit[1]
            if (!groups[title]) {
                groups[title] = [];
            }
            groups[title].push(report);
            return groups;
        }, {});
        const groupArrays = Object.keys(groups).map((title) => {
            return {
                title,
                data: groups[title]
            };
        });
        setReportsData(groupArrays)
    }
    useEffect(() => {
        LoadUserReports()
    }, []);

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
                        onRefresh={LoadUserReports}
                        refreshing={false}
                    />
                }
            >
                { /* Histórico */}
                <SectionTitle title="Histórico" />
                {
                    reportsData === null ?
                        <View style={[elements.subContainerWhite, { height: 375, marginBottom: 25, alignItems: "center", justifyContent: "center" }]}>
                            <ActivityIndicator size={"large"} color={theme.colors.secondary1} animating={reportsData === null} />
                        </View>
                        :
                        <SectionList
                            nestedScrollEnabled={true}
                            style={[elements.subContainerWhite, { height: 375, marginBottom: 25 }]}
                            contentContainerStyle={styles.container}
                            // Configurações dos elementos do Relatório
                            //sections={[...EXAMPLE_REPORTS, ...EXAMPLE_REPORTS2]}
                            sections={reportsData}
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
                }


                { /* Estatísticas */}
                <SectionTitle title="Relatórios" />
                <View style={[elements.subContainerGreen, { height: 325 }]}>

                </View>

                <View style={{ height: 25 }} />
            </ScrollView>
        </View>
    );
}