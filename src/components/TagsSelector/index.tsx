import React, { useEffect, useState } from 'react';

import {
    Text,
    View,
    TouchableOpacity,
    UIManager,
    FlatList,
    LayoutAnimation,
    Platform
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';
import { SectionTitle } from '../SectionTitle';

import { MaterialIcons } from "@expo/vector-icons"

type TagSectionProps = {
    tags: Array<string>
}

function CreateSectionData(tags: string[]) {
    const data = [];
    for (let index = 0; index < tags.length; index++) {
        const tagTitle = tags[index];
        data[index] = {
            id: index,
            title: tagTitle,
            checked: false
        }
    }
    return data;
}

function TagSection({ tags }: TagSectionProps) {
    const [sectionData, setSectionData] = useState([] as any);

    function UpdateTagsData() {
        const checkedData = [...sectionData].filter(tag => tag.checked === true);
        const uncheckedData = [...sectionData].filter(tag => tag.checked === false);
        const sortedData = checkedData.concat(uncheckedData);
        setSectionData(sortedData);
    }

    useEffect(() => {
        (() => {
            const newSectionData = CreateSectionData(tags);
            setSectionData(newSectionData)
        })();
    }, []);

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            key={item.id}
            style={item.checked ? [styles.tag, { borderColor: theme.colors.primary1, borderWidth: 3 }] : styles.tag}
            activeOpacity={0.75}
            onPress={() => {
                const updatedSectionData = sectionData
                updatedSectionData.find((x: any) => x.id === item.id).checked = !item.checked
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); //.spring
                setSectionData(updatedSectionData)
                UpdateTagsData()
            }}
        >
            <Text style={styles.tagText}>{item.title}</Text>
            {
                item.checked ? <MaterialIcons name="remove" size={18} color="white" /> :
                    <MaterialIcons name="add" size={18} color="white" />
            }
        </TouchableOpacity>
    );
    return (
        <FlatList
            style={{ marginBottom: 1 }}
            contentContainerStyle={styles.tagSection}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={sectionData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
    )
}

export function TagsSelector() {
    return (
        <View style={styles.container}>
            <SectionTitle title='Tempo de Permanência' marginBottom={1} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection tags={['Até 5 dias', '1 semana', '2 semanas', 'Mais de 1 mês']} />

            <SectionTitle title='Vegetação' marginBottom={1} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection tags={['Rasteira', 'Alta', 'Inexistente']} />

            <SectionTitle title='Animais' marginBottom={1} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection tags={['Moscas', 'Porcos', 'Cavalos', 'Escorpiões', 'Cobras', 'Sapos', 'Outros']} />

            <SectionTitle title='Terreno' marginBottom={1} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection tags={['Baldio', 'Abandonado', 'Íngrime', 'Inacessível']} />

            <SectionTitle title='Contato' marginBottom={1} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection tags={['Desconhecido', 'Sem resposta']} />
        </View>
    );
}