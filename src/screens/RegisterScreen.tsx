import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/user';
import { saveUser } from '../database/userDb';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Чоловіча');
  const [goal, setGoal] = useState('Покупки');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '+380 ';
    if (cleaned.length > 3) {
      const rest = cleaned.slice(3);
      if (rest.length <= 2) formatted += `(${rest}`;
      else if (rest.length <= 5) formatted += `(${rest.slice(0, 2)}) ${rest.slice(2)}`;
      else if (rest.length <= 7) formatted += `(${rest.slice(0, 2)}) ${rest.slice(2, 5)}-${rest.slice(5)}`;
      else formatted += `(${rest.slice(0, 2)}) ${rest.slice(2, 5)}-${rest.slice(5, 7)}-${rest.slice(7, 9)}`;
    }
    setPhone(formatted);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Помилка', 'Необхідний дозвіл для вибору фото з галереї');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Помилка', 'Будь ласка, заповніть обов’язкові поля');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Помилка', 'Ви повинні погодитися з правилами сервісу');
      return;
    }

    try {
      await saveUser({
        firstName,
        lastName,
        birthDate: birthDate || '01.01.2000',
        phone,
        email,
        city,
        password,
        gender,
        goal,
        agreedToTerms,
        photoUri: photoUri || undefined,
      });

      navigation.navigate('ProfileView', {});
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося зберегти дані у БД');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Реєстрація</Text>

        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoText}>📷 Додати фото</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Ім’я *</Text>
        <TextInput style={styles.input} placeholder="Іван" placeholderTextColor="#94a3b8" value={firstName} onChangeText={setFirstName} />

        <Text style={styles.label}>Прізвище *</Text>
        <TextInput style={styles.input} placeholder="Іванов" placeholderTextColor="#94a3b8" value={lastName} onChangeText={setLastName} />

        <Text style={styles.label}>Дата народження</Text>
        <TextInput style={styles.input} placeholder="DD.MM.YYYY" placeholderTextColor="#94a3b8" value={birthDate} onChangeText={setBirthDate} />

        <Text style={styles.label}>Номер телефону</Text>
        <TextInput style={styles.input} placeholder="+380 (___) ___-__-__" placeholderTextColor="#94a3b8" value={phone} onChangeText={handlePhoneChange} keyboardType="phone-pad" />

        <Text style={styles.label}>Email *</Text>
        <TextInput style={styles.input} placeholder="example@mail.com" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Місто проживання</Text>
        <TextInput style={styles.input} placeholder="Київ" placeholderTextColor="#94a3b8" value={city} onChangeText={setCity} />

        <Text style={styles.label}>Пароль *</Text>
        <TextInput style={styles.input} placeholder="******" placeholderTextColor="#94a3b8" secureTextEntry value={password} onChangeText={setPassword} />

        <Text style={styles.label}>Стать</Text>
        <View style={styles.row}>
          {['Чоловіча', 'Жіноча'].map((item) => (
            <TouchableOpacity key={item} style={[styles.choiceBtn, gender === item && styles.activeBtn]} onPress={() => setGender(item)}>
              <Text style={styles.btnText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Основна мета реєстрації</Text>
        <TextInput style={styles.input} placeholder="Покупки, продаж тощо" placeholderTextColor="#94a3b8" value={goal} onChangeText={setGoal} />

        <View style={styles.checkboxContainer}>
          <Switch value={agreedToTerms} onValueChange={setAgreedToTerms} trackColor={{ false: '#334155', true: '#6366f1' }} />
          <Text style={styles.checkboxText}>Погоджуюсь із правилами сервісу та обробкою даних</Text>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Зареєструватися</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  photoContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  photoPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  photoText: { color: '#94a3b8', fontSize: 12 },
  label: { color: '#94a3b8', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#1e293b', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 14 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  choiceBtn: { flex: 1, padding: 12, backgroundColor: '#1e293b', borderRadius: 8, alignItems: 'center' },
  activeBtn: { backgroundColor: '#6366f1' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 10 },
  checkboxText: { color: '#94a3b8', flex: 1, fontSize: 13 },
  submitBtn: { backgroundColor: '#6366f1', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});