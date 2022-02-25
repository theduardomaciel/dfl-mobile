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
            color: theme.colors.primary1,
            fontSize: 12
        }}
    />
);

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

const months = ["Jan.", "Fev.", "Mar.", "Abr.", "Jun.", "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."]

/* function maxValue(arr) {
    let max = arr[0];

    for (let val of arr) {
    if (val > max) {
        max = val;
    }
    }
    return max;
} */

export function Account({ navigation }) {
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

    const SectionItem = ({ item }: any) => {
        /* const report = user.reports.find(report => {
            return report.id === item.id
        }) */
        return (
            <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                style={styles.report_container}
                onPress={() => { navigation.navigate("Report", { item }) }}
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
                        uri: item.image_url !== "" ? item.image_url : "https://github.com/theduardomaciel.png"
                    }}
                />
            </TouchableOpacity>
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

    function GetReportsAmountByMonth() {
        const data = user.reports;
        const amountsByMonth = new Array(12).fill(0) as Array<number>;
        /* const groups = data.reduce((groups, report) => {
            const date = new Date(report.createdAt);
            const month = date.getMonth()
            if (!groups[month]) {
                groups[month] = 0;
            }
            groups[month] += 1;
            return groups;
        }, [] as Array<number>); */
        for (let index = 0; index < data.length; index++) {
            const report = data[index];
            const date = new Date(report.createdAt);
            const month = date.getMonth()
            amountsByMonth[month] = amountsByMonth[month] + 1;
        }
        console.log(amountsByMonth)
        return amountsByMonth
    }

    const [reportsAmountBars, setReportsAmountBars] = useState([])
    function GetReportsAmountBars() {

        const reportsAmountByMonth = GetReportsAmountByMonth()
        const max = Math.max(...reportsAmountByMonth);

        let bars = []
        for (let index = 0; index < 11; index++) {
            const monthAmount = reportsAmountByMonth[index];
            const height = monthAmount ? `${((100 * monthAmount) / max) - 25}%` : "10%"
            bars.push(
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 7, color: theme.colors.primary3, fontFamily: theme.fonts.subtitle400 }}>
                        {monthAmount ? monthAmount : 0}
                    </Text>
                    <View style={{ backgroundColor: theme.colors.primary3, borderRadius: 15, height: height, width: 12 }} />
                    <Text style={{ fontSize: 9, color: theme.colors.primary3, fontFamily: theme.fonts.title700 }}>
                        {months[index]}
                    </Text>
                </View>
            )
        }
        setReportsAmountBars(bars)
    }

    useEffect(() => {
        LoadUserReports()
        GetReportsAmountBars()
    }, []);

    // Ano = 0 | mês = 1 | dia = 2 (tem que dar o slice)
    const userCreatedAtSplit = user.createdAt.split("-")
    const userCreatedAt = userCreatedAtSplit[2].slice(0, 2) + "/" + userCreatedAtSplit[1] + "/" + userCreatedAtSplit[0]

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
                <SectionTitle title="Histórico" hasLine />
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
                <SectionTitle title="Estatísticas" hasLine />
                <View style={[elements.subContainerGreen, { height: 175, marginBottom: 15 }]}>
                    <SectionTitle title="Atividade de Contribuições" marginBottom={5} fontStyle={styles.statisticsTitle} />
                    <View style={styles.userActivityView}>
                        {reportsAmountBars}
                    </View>
                </View>

                <View style={[elements.subContainerGreen, { height: 85, marginBottom: 15, alignItems: "center" }]}>
                    <Text style={styles.statisticsTitle}>
                        {user.reports.length + " focos reportados no total"}
                    </Text>
                    <View style={{ width: "80%", height: 1, backgroundColor: theme.colors.primary2 }} />
                    <Text style={styles.statisticsTitle}>
                        {"0 focos reportados foram resolvidos"}
                    </Text>
                </View>

                <View style={[elements.subContainerGreen, { backgroundColor: theme.colors.primary2, height: 75, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }]}>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.statisticsTitle}>Data de Entrada:</Text>
                        <Text style={styles.statisticsDescription}>{userCreatedAt}</Text>
                    </View>
                    <View style={{ width: 1, height: "80%", backgroundColor: theme.colors.text1 }} />
                    <View style={{ flexDirection: "column" }}>
                        <Text style={[styles.statisticsTitle, { width: 125 }]}>Nível:</Text>
                        <Text style={styles.statisticsDescription}>{user.profile.level}</Text>
                    </View>
                </View>

                <View style={{ height: 25 }} />
            </ScrollView>
        </View>
    );
}