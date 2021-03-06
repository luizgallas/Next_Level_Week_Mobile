import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { useFocusEffect } from '@react-navigation/native';

import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import TeacherItem, {Teacher} from '../../components/TeacherItem';
import AsyncStorage from '@react-native-community/async-storage';

// UTILIZAR CONTEXT AQUI PARA PERMITIR QUE NÃO HAJA CONFLITO DE INFORMAÇÕES QUANDO DESFAVORITAMOS
// EM UMA TELA PARA A OUTRA

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);

                setFavorites(favoritedTeachers);
            }
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    )

    return (
        <View style={styles.container} >
            <PageHeader title='Meus proffys favoritos'/>

            <ScrollView 
                style={styles.teacherList} 
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}>
                {favorites.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id}
                            teacher={teacher}
                            favorited //Entende que é true
                        />
                    )
                })}
         
            </ScrollView>
        </View>
    )
}

export default Favorites;