import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, {Teacher} from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    )

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                })

                setFavorites(favoritedTeachersIds);
            }
        });
    }

    function handleToggleFiltersVisible() {
        setIsFilterVisible(!isFilterVisible);
    }

    async function handleFiltersSubmit() {
        loadFavorites();
       const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });

        setIsFilterVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container} >
            <PageHeader 
                title='Proffys disponíveis' 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name='filter' size={20} color='#FFF' />
                    </BorderlessButton>
                )}
                >
                { isFilterVisible && (<View style={styles.searchForm} >
                    <Text style={styles.label}>Matéria</Text>
                    <TextInput
                        value={subject}
                        onChangeText={subject => setSubject(subject)}
                        style={styles.input} 
                        placeholder="Qual a matéria?"
                        placeholderTextColor="#c1bccc"
                    />

                    <View style={styles.inputGroup}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                            <TextInput
                            value={week_day}
                            onChangeText={week_day => setWeekDay(week_day)}
                            style={styles.input} 
                            placeholder="Qual o dia?"
                            placeholderTextColor="#c1bccc"
                            />
                        </View>


                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                            <TextInput
                            value={time}
                            onChangeText={time => setTime(time)}
                            style={styles.input} 
                            placeholder="Qual horário?"
                            placeholderTextColor="#c1bccc"
                            />
                        </View>
                    </View>
                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                </View>
                )}
            </PageHeader>

            <ScrollView 
                style={styles.teacherList} 
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}>

                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    
                    )
                })}

            </ScrollView>
            
        </View>
    )
}

export default TeacherList;