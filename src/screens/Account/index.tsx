import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    SectionList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    ImageBackground
} from "react-native";

import { ProfileIcon } from "../../components/ProfileIcon";
import { SectionTitle } from "../../components/SectionTitle";

import { elements } from "../../global/styles/elements";
import { theme } from "../../global/styles/theme";

import { styles } from "./styles";

import TrashbinSvg from "../../assets/icons/trashbin.svg"

import { useAuth } from "../../hooks/useAuth";

import Toast from 'react-native-toast-message';
import FocusAwareStatusBar from "../../utils/functions/FocusAwareStatusBar";
import { hideNavigationBar } from "react-native-navigation-bar-color";

function GetReportsAmountByMonth(profile) {
    const data = profile.reports;
    const amountsByMonth = new Array(12).fill(0) as Array<number>;
    if (!data) return amountsByMonth;
    for (let index = 0; index < data.length; index++) {
        const report = data[index];
        const date = new Date(report.createdAt);
        const month = date.getMonth()
        amountsByMonth[month] = amountsByMonth[month] + 1;
    }
    return amountsByMonth
}

function GetReportsAmountBars(profile) {
    const reportsAmountByMonth = GetReportsAmountByMonth(profile)
    const max = Math.max(...reportsAmountByMonth);

    const TOP_DIFFERENCE = 30
    let bars = []
    for (let index = 0; index < 11; index++) {
        const monthAmount = reportsAmountByMonth[index + 1];
        const MAX_HEIGHT = 100 - TOP_DIFFERENCE
        const PERCENTAGE = `${Math.abs((monthAmount * MAX_HEIGHT) / max)}%`
        const height = monthAmount ? PERCENTAGE : "10%"
        bars.push(
            <View key={index} style={{ alignItems: "center" }}>
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
    return bars
}

// Os dados em uma SectionList devem ser sempre organizados em: "Title" e "Data". 
// Se esse nomes não estiverem escritos, um erro será retornado.

const SectionHeader = ({ section }: any) => (
    <SectionTitle
        title={section.title}
        color={theme.colors.primary1}
        hasLine
        viewStyle={{ width: "100%" }}
        fontStyle={{
            fontFamily: theme.fonts.subtitle900,
            color: theme.colors.primary1,
            fontSize: 12
        }}
    />
);

const EMPTY = []

const EmptyItem = ({ item, color, fontSize }: any) => {
    return (
        <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
            {
                color ?
                    <TrashbinSvg
                        fill={theme.colors.text1}
                        width={25}
                        height={45}
                    /> :
                    <TrashbinSvg
                        fill={theme.colors.secondary1}
                        width={50}
                        height={90}
                    />
            }
            <Text style={{
                fontFamily: theme.fonts.title700,
                color: color ? color : theme.colors.secondary1,
                fontSize: fontSize ? fontSize : 18,
                textAlign: "center"
            }}>
                Está um pouco vazio aqui...
            </Text>
            <Text style={{
                fontFamily: theme.fonts.subtitle400,
                color: color ? color : theme.colors.secondary1,
                fontSize: fontSize ? fontSize : 16,
                textAlign: "center"
            }}>
                Que tal reportar um foco de lixo para que ele apareça aqui?
            </Text>
        </View>
    )
}

const months = ["Jan.", "Fev.", "Mar.", "Abr.", "Jun.", "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."]

export function Account({ navigation, route }) {
    const { user } = useAuth();

    const Header = () => {
        return (
            <View style={styles.header}>
                <View style={styles.userInfoContainer}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
                        {user.first_name + " " + user.last_name}
                    </Text>
                    <Text style={styles.username}>
                        {user.profile.username ? user.profile.username : ""}
                    </Text>
                </View>
                <View style={{ width: "25%", alignItems: "flex-end" }}>
                    <ProfileIcon uri={user.profile.image_url} openConfig />
                </View>
            </View>
        )
    }

    const SectionItem = ({ item }: any) => {
        /* const report = user.profile.reports.find(report => {
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
                        title={item.address}
                        color={theme.colors.primary1}
                        hasLine
                        viewStyle={{ width: "100%", marginBottom: 0 }}
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
                    progressiveRenderingEnabled
                    loadingIndicatorSource={{ uri: "/src/assets/icon/loading_icon.gif" }}
                    style={styles.report_image}
                    source={{
                        uri: item.images_urls[0]
                    }}
                />
            </TouchableOpacity>
        )
    }

    // Código original: https://stackoverflow.com/questions/46802448/how-do-i-group-items-in-an-array-by-date
    const [reportsData, setReportsData] = useState(null)
    async function LoadUserReports(profile) {
        const data = profile.reports;
        data.sort((a, b) => {
            const date1 = new Date(b.createdAt) as any;
            const date2 = new Date(a.createdAt) as any;
            return date1 - date2;
        });
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

    const [reportsAmountBars, setReportsAmountBars] = useState([])

    const showSuccessToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Eba! Deu tudo certo!',
            text2: 'O relatório selecionado foi excluído com sucesso ✅',
        });
    }

    const showErrorToast = () => {
        Toast.show({
            type: 'error',
            text1: 'Ocorreu um erro ao deletar o relatório.',
            text2: 'Tente novamente mais tarde ❌'
        });
    }

    async function FetchData() {
        console.log("Atualizando dados da tela de relatórios.")
        if (user.profile.reports) {
            LoadUserReports(user.profile)
            setReportsAmountBars(GetReportsAmountBars(user.profile))
        } else {
            setReportsData([])
            setReportsAmountBars([<EmptyItem fontSize={12} color={"white"} />])
        }
    }

    useEffect(() => {
        hideNavigationBar()
        console.log("Verificando mudanças na tela de relatórios.")
        if (route.params?.status) {
            const status = route.params.status.split("_")[0]
            if (status === "error") {
                console.log("Houve um erro ao apagar relatório. Exibindo toast.")
                showErrorToast()
            } else if (status === "success") {
                console.log("Houve sucesso ao apagar relatório. Exibindo toast.")
                showSuccessToast();
            }
        }
        if (user.profile.reports) {
            FetchData()
        }
    }, [route.params?.status]);

    const [isLoading, setIsLoading] = useState(false)
    const onRefresh = () => {
        if (user.profile.reports) {
            setIsLoading(true)
            console.log("Atualizando informações dos relatórios do usuário.")
            LoadUserReports(user.profile)
            GetReportsAmountByMonth(user.profile)
            setIsLoading(false)
        }
    }

    if (user === null) return (
        <View style={{ flex: 1 }} />
    );

    // Ano = 0 | mês = 1 | dia = 2 (tem que dar o slice)
    const userCreatedAtSplit = user.createdAt.split("-")
    const userCreatedAt = userCreatedAtSplit[2].slice(0, 2) + "/" + userCreatedAtSplit[1] + "/" + userCreatedAtSplit[0]

    const userReportsSolvedAmount = user.profile.reports ? [...user.profile.reports].filter(report => report.resolved === true).length : 0

    return (
        <ImageBackground source={require("../../assets/placeholders/background_placeholder.png")} style={styles.container}>
            <FocusAwareStatusBar translucent backgroundColor={"transparent"} barStyle="dark-content" />
            <Header />
            <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                //fadingEdgeLength={25}
                nestedScrollEnabled={true}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={-10}
                        colors={[theme.colors.primary1]}
                        onRefresh={onRefresh}
                        refreshing={isLoading}
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
                            showsVerticalScrollIndicator={false}
                            /* Não colocar { flex: 1 } ou { height: "100%" } no contentContainerStyle que trava o scroll */
                            style={[elements.subContainerWhite, { height: 375, marginBottom: 25 }]}
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
                    <SectionTitle title="Atividade de Contribuições" viewStyle={{ marginBottom: 5 }} fontStyle={styles.statisticsTitle} />
                    <View style={styles.userActivityView}>
                        {reportsAmountBars}
                    </View>
                </View>

                <View style={[elements.subContainerGreen, { height: 85, marginBottom: 15, alignItems: "center" }]}>
                    <Text style={styles.statisticsTitle}>
                        {user.profile.reports ? user.profile.reports.length + " focos reportados no total" : "0 focos reportados no total"}
                    </Text>
                    <View style={{ width: "80%", height: 1, backgroundColor: theme.colors.primary2 }} />
                    <Text style={styles.statisticsTitle}>
                        {`${userReportsSolvedAmount} foco${userReportsSolvedAmount !== 1 && "s"} reportados foram resolvidos`}
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

                <View style={{ height: 100 }} />
            </ScrollView>
        </ImageBackground>
    );
}