import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, UserProfile } from '../types/user';
import { getLastUser } from '../database/userDb';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileView'>;

export const ProfileViewScreen: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLastUser().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Дані профілю відсутні в БД</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Збережені дані з БД</Text>

        {user.photoUri && (
          <Image source={{ uri: user.photoUri }} style={styles.avatar} />
        )}

        <View style={styles.card}>
          <Text style={styles.item}><Text style={styles.bold}>Ім'я:</Text> {user.firstName} {user.lastName}</Text>
          <Text style={styles.item}><Text style={styles.bold}>Дата народження:</Text> {user.birthDate}</Text>
          <Text style={styles.item}><Text style={styles.bold}>Телефон:</Text> {user.phone}</Text>
          <Text style={styles.item}><Text style={styles.bold}>Email:</Text> {user.email}</Text>
          <Text style={styles.item}><Text style={styles.bold}>Місто:</Text> {user.city}</Text>
          <Text style={styles.item}><Text style={styles.bold}>Стать:</Text> {user.gender}</Text>
          <Text style={styles.item}><Text style={styles.bold}>Мета:</Text> {user.goal}</Text>
          <Text style={styles.item}>
            <Text style={styles.bold}>Згода на збір даних:</Text> {user.agreedToTerms ? '✅ Так' : '❌ Ні'}
          </Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Повернутися до форми</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  card: { backgroundColor: '#1e293b', width: '100%', padding: 18, borderRadius: 12, gap: 10 },
  item: { color: '#cbd5e1', fontSize: 16 },
  bold: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: '#ef4444', fontSize: 16 },
  backBtn: { marginTop: 24, backgroundColor: '#6366f1', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
  backBtnText: { color: '#fff', fontWeight: 'bold' },
});