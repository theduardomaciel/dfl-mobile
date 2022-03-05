import React, { useEffect, useState } from 'react';

import {
    Text,
    View,
    TouchableOpacity,
    UIManager,
    FlatList,
    LayoutAnimation,
    Platform,
    ViewStyle
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';
import { SectionTitle } from '../SectionTitle';

import { MaterialIcons } from "@expo/vector-icons"

type TagSectionProps = {
    tags: Array<string>;
    section: string;
    onSelectTags: (section, tags) => void;
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

function TagSection({ tags, section, onSelectTags }: TagSectionProps) {
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
                onSelectTags(section, sectionData)
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

type TagsSelectorTypes = {
    onSelectTags: (tags) => void;
    style?: ViewStyle;
}

export function TagsSelector({ onSelectTags, style }: TagsSelectorTypes) {
    const [selectorTags, setSelectorTags] = useState({});
    const handleTags = (section, tags) => {
        const tagsCopy = selectorTags;
        tagsCopy[section] = tags;
        setSelectorTags(tagsCopy)
        onSelectTags(selectorTags)
    }
    return (
        <View style={style ? [styles.container, style] : styles.container}>
            <SectionTitle title='Tempo de Permanência' viewStyle={{ marginBottom: 5 }} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection section="time" tags={['Até 5 dias', '1 semana', '2 semanas', 'Mais de 1 mês']} onSelectTags={handleTags} />

            <SectionTitle title='Vegetação' viewStyle={{ marginBottom: 5 }} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection section="vegetation" tags={['Rasteira', 'Alta', 'Inexistente']} onSelectTags={handleTags} />

            <SectionTitle title='Animais' viewStyle={{ marginBottom: 5 }} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection section="animals" tags={['Moscas', 'Porcos', 'Cavalos', 'Escorpiões', 'Cobras', 'Sapos', 'Outros']} onSelectTags={handleTags} />

            <SectionTitle title='Terreno' viewStyle={{ marginBottom: 5 }} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection section="terrain" tags={['Baldio', 'Abandonado', 'Íngrime', 'Inacessível']} onSelectTags={handleTags} />

            <SectionTitle title='Contato' viewStyle={{ marginBottom: 5 }} fontStyle={{ fontSize: 18, color: theme.colors.secondary1, fontFamily: theme.fonts.section400 }} />
            <TagSection section="contact" tags={['Desconhecido', 'Sem resposta']} onSelectTags={handleTags} />
        </View>
    );
}