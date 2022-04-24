import React, { useEffect } from "react";
import { SvgProps } from "react-native-svg";
import { View, Text, ScrollView } from "react-native";

import { TextButton } from "../../../components/TextButton";
import { elements } from "../../../global/styles/elements";
import { theme } from "../../../global/styles/theme";

import { styles } from "./styles";

type Props = {
    title: string;
    icon: React.FC<SvgProps>;
    description: React.ReactNode;
    explanation: React.ReactNode;
}

import { MaterialIcons } from '@expo/vector-icons';
import { AccordionOptions } from "../../../components/AccordionOptions";
import { HintView, HintViewTextStyle } from "../../../components/HintView";
import { UpdateNavigationBar } from "../../../utils/functions/UpdateNavigationBar";

const Bold = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

const PERMISSIONS = [
    {
        id: "1",
        title: "Localização",
        iconName: "location-on",
        description: <Text>
            É o mais importante para o funcionamento do aplicativo.{`\n`}É necessária para as funções de <Bold>Comunidade</Bold> e <Bold>Localização do Foco de Lixo.</Bold>
        </Text>,
        explanation: `Na função Comunidade, utilizamos sua localização para mantê-lo conectado com outros usuários de sua cidade.\n
        Na função Localização do Foco de Lixo, utilizamos sua localização para armazenar a posição do foco de lixo. Desta maneira podemos notificar os órgãos responsáveis pela coleta.`,
        elements: <HintView CustomText={
            () => (
                <View>
                    <Text style={HintViewTextStyle}>
                        <Bold>Na função Comunidade,</Bold> utilizamos sua localização para mantê-lo conectado com outros usuários de sua cidade.{'\n'}{'\n'}
                        <Bold>Na função Localização do Foco de Lixo,</Bold> utilizamos sua localização para armazenar a posição do foco de lixo. Desta maneira podemos notificar os órgãos responsáveis pela coleta.
                    </Text>
                </View>
            )
        } />
    },
    {
        id: "1",
        title: "Câmera",
        iconName: "photo-camera",
        description: <Text>
            É crucial para a <Bold>Identificação do Foco de Lixo</Bold>, permitindo que as autoridades analisem a situação atual do local.{`\n`}Também permite que a <Bold>Foto de Perfil</Bold> seja alterada com uma foto da câmera.
        </Text>,
        explanation: `É necessária para as funções de Identificação do Foco de Lixo e Foto de Perfil.`,
        elements: <HintView customStyle={{ marginTop: 5 }} CustomText={
            () => (
                <View>
                    <Text style={HintViewTextStyle}>
                        É necessária para as funções de <Bold>Identificação do Foco de Lixo</Bold> e <Bold>Foto de Perfil.</Bold>
                    </Text>
                </View>
            )
        } />
    },
]

export function PermissionsExplanation({ navigation }) {
    useEffect(() => {
        UpdateNavigationBar("dark", false, "transparent")
    }, [])

    function PermissionItem(itemMaster) {
        const item = itemMaster.item;
        return (
            <View style={styles.elementsContainer}>
                <View style={styles.rowContainer}>
                    <View style={{ justifyContent: "space-between" }}>
                        <MaterialIcons name={item.iconName} size={32} color={theme.colors.secondary1} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>{item.title}</Text>
                        <Text style={styles.permissionDescription}>{item.description}</Text>
                    </View>
                </View>
                <AccordionOptions
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                    }}
                    id={item.id}
                    accordionComponents={item.elements}
                />
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <View style={[styles.elementsContainer, { marginTop: 25 }]}>
                <Text style={styles.title}>
                    Antes de começar, precisamos de algumas <Bold>permissões</Bold>.
                </Text>
                <Text style={styles.subtitle}>
                    Só pediremos o necessário e não se preocupe, está tudo explicadinho aqui em baixo pra você ficar por dentro de tudo.
                </Text>
                <View style={styles.line} />
            </View>
            <ScrollView style={{ marginBottom: 15 }}>
                <PermissionItem item={PERMISSIONS[0]} />
                <View style={[styles.line, { width: "70%", marginTop: 15, marginBottom: 0 }]} />
                <PermissionItem item={PERMISSIONS[1]} />
            </ScrollView>
            <TextButton
                title="Continuar"
                shadow
                buttonStyle={{ height: 45, width: "90%", marginBottom: 15 }}
                colors={[theme.colors.primary1, theme.colors.secondary1]}
                onPress={() => { navigation.navigate("PermissionsRequest", { update: true }) }} />
        </View>
    );
}