import React, { useState } from 'react';

import {
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import { styles } from './styles';
import { theme } from '../../global/styles/theme';
import { SectionTitle } from '../SectionTitle';

type TagSectionProps = {
    tags: Array<string>
}

function TagSection({ tags }: TagSectionProps) {
    let section = []
    for (let index = 0; index < tags.length; index++) {
        const tagTitle = tags[index];
        section.push(
            <TouchableOpacity key={index} style={styles.tag} activeOpacity={0.5}>
                <Text style={styles.tagText}>{tagTitle}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <ScrollView
            style={{ marginBottom: 5 }}
            contentContainerStyle={styles.tagSection}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {section}
        </ScrollView>
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